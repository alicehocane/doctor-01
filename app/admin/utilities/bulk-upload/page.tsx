"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload, AlertCircle, CheckCircle, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

// Size of each batch to process
const BATCH_SIZE = 10

export default function BulkUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jsonData, setJsonData] = useState("")
  const [estaSubiendo, setEstaSubiendo] = useState(false)
  const [progresoSubida, setProgresoSubida] = useState(0)
  const [loteActual, setLoteActual] = useState(0)
  const [totalLotes, setTotalLotes] = useState(0)
  const [resultado, setResultado] = useState<{
    exito: boolean
    mensaje: string
    totalProcesados: number
    exitosos: number
    errores: number
    listaErrores: { medico: string; error: string }[]
  } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return

    // Verificar tamaño del archivo antes de leerlo
    if (archivo.size > 10 * 1024 * 1024) {
      // Límite de 10MB
      toast({
        title: "Archivo demasiado grande",
        description: "El archivo no debe exceder los 10MB. Por favor, divida los datos en archivos más pequeños.",
        variant: "destructive",
      })
      return
    }

    const lector = new FileReader()
    lector.onload = (e) => {
      const contenido = e.target?.result as string
      setJsonData(contenido)
    }
    lector.readAsText(archivo)
  }

  // Validate JSON format
  const validarJson = (cadenaJson: string): { valido: boolean; mensaje: string; datos?: any[] } => {
    try {
      const analizado = JSON.parse(cadenaJson)
      if (!Array.isArray(analizado)) {
        return {
          valido: false,
          mensaje: "Formato JSON inválido. Se esperaba un array de objetos.",
        }
      }
      return { valido: true, mensaje: "JSON válido", datos: analizado }
    } catch (error) {
      return {
        valido: false,
        mensaje: "Error al analizar el JSON: " + (error instanceof Error ? error.message : "Error desconocido"),
      }
    }
  }

  // Process a batch of doctors
  const procesarLote = async (
    lote: any[],
  ): Promise<{
    exito: boolean
    mensaje: string
    exitosos: number
    errores: number
    listaErrores: { medico: string; error: string }[]
  }> => {
    try {
      const respuesta = await fetch("/api/process-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lote),
      })

      if (!respuesta.ok) {
        // Si obtenemos un error 413, intentamos procesar uno por uno
        if (respuesta.status === 413 && lote.length > 1) {
          console.log("Lote demasiado grande, procesando uno por uno")

          // Procesar cada médico individualmente
          let exitosos = 0
          let errores = 0
          const listaErrores: { medico: string; error: string }[] = []

          for (const medico of lote) {
            try {
              const respuestaIndividual = await fetch("/api/doctor", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(medico),
              })

              const resultado = await respuestaIndividual.json()

              if (resultado.exito) {
                exitosos++
              } else {
                errores++
                listaErrores.push({
                  medico: medico.fullName || "Médico sin nombre",
                  error: resultado.mensaje || "Error desconocido",
                })
              }
            } catch (error) {
              errores++
              listaErrores.push({
                medico: medico.fullName || "Médico sin nombre",
                error: error instanceof Error ? error.message : "Error desconocido",
              })
            }
          }

          return {
            exito: errores === 0,
            mensaje: `Procesados individualmente: ${exitosos} éxitos, ${errores} errores.`,
            exitosos,
            errores,
            listaErrores,
          }
        }

        const textoError = await respuesta.text()
        throw new Error(`Error del servidor: ${respuesta.status} ${textoError}`)
      }

      return await respuesta.json()
    } catch (error) {
      console.error("Error al procesar lote:", error)
      return {
        exito: false,
        mensaje: "Error al procesar lote: " + (error instanceof Error ? error.message : "Error desconocido"),
        exitosos: 0,
        errores: lote.length,
        listaErrores: lote.map((medico) => ({
          medico: medico.fullName || "Médico sin nombre",
          error: "Error de comunicación con el servidor",
        })),
      }
    }
  }

  const handleUpload = async () => {
    if (!jsonData.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingrese datos JSON o cargue un archivo",
        variant: "destructive",
      })
      return
    }

    // Validar formato JSON primero
    const validacion = validarJson(jsonData)
    if (!validacion.valido || !validacion.datos) {
      toast({
        title: "JSON inválido",
        description: validacion.mensaje,
        variant: "destructive",
      })
      return
    }

    setEstaSubiendo(true)
    setResultado(null)
    setProgresoSubida(0)

    try {
      const medicos = validacion.datos

      // Calcular número de lotes
      const lotes = Math.ceil(medicos.length / BATCH_SIZE)
      setTotalLotes(lotes)

      // Inicializar resultados
      let totalExitosos = 0
      let totalErrores = 0
      const todosErrores: { medico: string; error: string }[] = []

      // Procesar cada lote individualmente
      for (let i = 0; i < lotes; i++) {
        setLoteActual(i + 1)
        setProgresoSubida(Math.round(((i + 1) / lotes) * 100))

        const indiceInicio = i * BATCH_SIZE
        const indiceFin = Math.min(indiceInicio + BATCH_SIZE, medicos.length)
        const lote = medicos.slice(indiceInicio, indiceFin)

        // Procesar este lote
        const resultadoLote = await procesarLote(lote)

        // Agregar resultados
        totalExitosos += resultadoLote.exitosos
        totalErrores += resultadoLote.errores
        todosErrores.push(...resultadoLote.listaErrores)

        // Notificar progreso para conjuntos de datos grandes
        if (lotes > 5 && (i % 5 === 0 || i === lotes - 1)) {
          toast({
            title: "Progreso",
            description: `Procesados ${i + 1} de ${lotes} lotes`,
          })
        }
      }

      // Resultado final
      const resultadoFinal = {
        exito: totalErrores === 0,
        mensaje: `Se procesaron ${medicos.length} registros. ${totalExitosos} médicos añadidos correctamente, ${totalErrores} errores.`,
        totalProcesados: medicos.length,
        exitosos: totalExitosos,
        errores: totalErrores,
        listaErrores: todosErrores,
      }

      setResultado(resultadoFinal)

      if (resultadoFinal.exito) {
        toast({
          title: "Carga exitosa",
          description: resultadoFinal.mensaje,
        })
      } else {
        toast({
          title: "Carga completada con errores",
          description: `${totalExitosos} médicos añadidos, ${totalErrores} errores.`,
          variant: "warning",
        })
      }
    } catch (error) {
      console.error("Error al subir médicos:", error)
      toast({
        title: "Error",
        description:
          "Ocurrió un error al procesar la carga: " + (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive",
      })
    } finally {
      setEstaSubiendo(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Carga Masiva de Médicos</h1>
          <p className="text-muted-foreground">Sube múltiples registros de médicos a la vez.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cargar Datos JSON</CardTitle>
          <CardDescription>
            Sube un archivo JSON o pega directamente el contenido JSON con los datos de los médicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Información importante</AlertTitle>
            <AlertDescription>
              <p>
                Para evitar errores de tamaño, el sistema procesará los registros en lotes de {BATCH_SIZE}. Si un lote
                es demasiado grande, procesará los registros uno por uno automáticamente.
              </p>
              <p className="mt-1">Tamaño máximo recomendado: 10MB o 1000 registros por carga.</p>
            </AlertDescription>
          </Alert>

          <div>
            <p className="text-sm text-muted-foreground my-4">
              El archivo debe contener un array de objetos, cada uno con los datos de un médico. Campos requeridos:
              fullName, licenseNumber, specialties, cities, phoneNumbers.
            </p>

            <div className="flex items-center gap-4 mb-4">
              <input type="file" accept=".json" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={estaSubiendo}>
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Archivo JSON
              </Button>
              <span className="text-sm text-muted-foreground">
                {fileInputRef.current?.files?.[0]?.name || "Ningún archivo seleccionado"}
              </span>
            </div>

            <div className="space-y-2">
              <label htmlFor="json-data" className="text-sm font-medium">
                O pega el contenido JSON directamente:
              </label>
              <Textarea
                id="json-data"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder='[{"fullName": "Dr. Juan Pérez", "licenseNumber": "12345", "specialties": ["Cardiología"], "cities": ["Monterrey"], "phoneNumbers": ["8112345678"]}]'
                className="min-h-[200px] font-mono text-sm"
                disabled={estaSubiendo}
              />
            </div>
          </div>

          {estaSubiendo && (
            <div className="space-y-2">
              <p className="text-sm">
                Procesando lote {loteActual} de {totalLotes}...
              </p>
              <Progress value={progresoSubida} className="h-2" />
              <p className="text-xs text-muted-foreground">{progresoSubida}% completado</p>
            </div>
          )}

          {resultado && (
            <Alert variant={resultado.exito ? "default" : "destructive"}>
              {resultado.exito ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{resultado.exito ? "Carga Exitosa" : "Error en la Carga"}</AlertTitle>
              <AlertDescription>
                <p>{resultado.mensaje}</p>
                {resultado.listaErrores.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Errores ({resultado.listaErrores.length}):</p>
                    <div className="max-h-40 overflow-y-auto mt-1 border rounded p-2">
                      <ul className="list-disc pl-5 space-y-1">
                        {resultado.listaErrores.map((error, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{error.medico}:</span> {error.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={estaSubiendo}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={estaSubiendo || !jsonData.trim()}>
            {estaSubiendo ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Cargar Médicos
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {resultado?.exito && (
        <div className="flex justify-end">
          <Button onClick={() => router.push("/admin/doctors")}>Ver Lista de Médicos</Button>
        </div>
      )}
    </div>
  )
}
