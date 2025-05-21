"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload, AlertCircle, CheckCircle, Loader2, Info, Settings, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateDoctorId, ensureUniqueDoctorId } from "@/lib/utils-doctor"

// Límite máximo de documentos por lote de Firestore
const FIRESTORE_BATCH_LIMIT = 500

// Función para esperar un tiempo determinado
const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function BulkUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jsonData, setJsonData] = useState("")
  const [estaSubiendo, setEstaSubiendo] = useState(false)
  const [progresoSubida, setProgresoSubida] = useState(0)
  const [loteActual, setLoteActual] = useState(0)
  const [totalLotes, setTotalLotes] = useState(0)
  const [tamanoLotes, setTamanoLotes] = useState([400, 400, 400, 400])
  const [tamanoLotePersonalizado, setTamanoLotePersonalizado] = useState("400, 400, 400, 400")
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false)
  const [ignorarCamposFaltantes, setIgnorarCamposFaltantes] = useState(true)
  const [retrasoEntreLotes, setRetrasoEntreLotes] = useState(1000) // 1 segundo por defecto
  const [resultado, setResultado] = useState<{
    exito: boolean
    mensaje: string
    totalProcesados: number
    exitosos: number
    errores: number
    listaErrores: { medico: string; error: string }[]
  } | null>(null)

  // Actualizar tamaños de lotes cuando cambia el input personalizado
  useEffect(() => {
    const actualizarTamanoLotes = () => {
      try {
        const valores = tamanoLotePersonalizado
          .split(",")
          .map((v) => Number.parseInt(v.trim()))
          .filter((v) => !isNaN(v) && v > 0 && v <= FIRESTORE_BATCH_LIMIT)

        if (valores.length > 0) {
          setTamanoLotes(valores)
        }
      } catch (error) {
        console.error("Error al parsear tamaños de lotes:", error)
      }
    }

    actualizarTamanoLotes()
  }, [tamanoLotePersonalizado])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return

    // Verificar tamaño del archivo antes de leerlo
    if (archivo.size > 20 * 1024 * 1024) {
      // Límite de 20MB
      toast({
        title: "Archivo demasiado grande",
        description: "El archivo no debe exceder los 4MB. Por favor, divida los datos en archivos más pequeños.",
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

  // Validar formato JSON
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

  // Preparar médico para subida, proporcionando valores predeterminados para campos faltantes
  const prepararMedico = (medico: any): { valido: boolean; medicoPreparado: any; error?: string } => {
    try {
      // Si estamos ignorando campos faltantes, proporcionamos valores predeterminados
      if (ignorarCamposFaltantes) {
        const medicoPreparado = {
          // Usar el valor existente o un valor predeterminado
          fullName: medico.fullName || "Sin nombre",
          licenseNumber: medico.licenseNumber || "Sin licencia",
          specialties: Array.isArray(medico.specialties) ? medico.specialties : ["Sin especialidad"],
          cities: Array.isArray(medico.cities) ? medico.cities : ["Sin ciudad"],
          phoneNumbers: Array.isArray(medico.phoneNumbers) ? medico.phoneNumbers : ["Sin teléfono"],
          // Copiar el resto de campos
          ...medico,
        }

        return { valido: true, medicoPreparado }
      } else {
        // Validación estricta si no estamos ignorando campos faltantes
        if (
          !medico.fullName ||
          !medico.licenseNumber ||
          !medico.specialties ||
          !medico.cities ||
          !medico.phoneNumbers ||
          !Array.isArray(medico.specialties) ||
          !Array.isArray(medico.cities) ||
          !Array.isArray(medico.phoneNumbers)
        ) {
          return {
            valido: false,
            medicoPreparado: medico,
            error: "Campos requeridos faltantes o formato incorrecto",
          }
        }

        return { valido: true, medicoPreparado: medico }
      }
    } catch (error) {
      return {
        valido: false,
        medicoPreparado: medico,
        error: error instanceof Error ? error.message : "Error desconocido",
      }
    }
  }

  // Procesar un lote usando writeBatch de Firestore
  const procesarLote = async (
    lote: any[],
  ): Promise<{
    exito: boolean
    mensaje: string
    exitosos: number
    errores: number
    listaErrores: { medico: string; error: string }[]
  }> => {
    // Resultados para este lote
    let exitosos = 0
    let errores = 0
    const listaErrores: { medico: string; error: string }[] = []

    // Asegurarse de que el lote no exceda el límite de Firestore
    if (lote.length > FIRESTORE_BATCH_LIMIT) {
      console.warn(`El lote excede el límite de Firestore (${FIRESTORE_BATCH_LIMIT}). Dividiendo en sub-lotes.`)

      // Dividir en sub-lotes que respeten el límite
      const subLotes: any[][] = []
      for (let i = 0; i < lote.length; i += FIRESTORE_BATCH_LIMIT) {
        subLotes.push(lote.slice(i, i + FIRESTORE_BATCH_LIMIT))
      }

      // Procesar cada sub-lote
      for (let i = 0; i < subLotes.length; i++) {
        const subLote = subLotes[i]

        // Procesar el sub-lote
        const resultadoSubLote = await procesarLote(subLote)
        exitosos += resultadoSubLote.exitosos
        errores += resultadoSubLote.errores
        listaErrores.push(...resultadoSubLote.listaErrores)

        // Esperar entre sub-lotes si no es el último
        if (i < subLotes.length - 1) {
          await esperar(retrasoEntreLotes)
        }
      }

      return {
        exito: errores === 0,
        mensaje: `Lote procesado: ${exitosos} éxitos, ${errores} errores.`,
        exitosos,
        errores,
        listaErrores,
      }
    }

    try {
      // Crear un nuevo lote de escritura
      const batch = writeBatch(db)
      const medicosValidos: any[] = []

      // Primero validar y preparar todos los médicos
      for (const medico of lote) {
        try {
          // Preparar médico con valores predeterminados si es necesario
          const { valido, medicoPreparado, error } = prepararMedico(medico)

          if (!valido) {
            errores++
            listaErrores.push({
              medico: medico.fullName || "Médico sin nombre",
              error: error || "Error desconocido",
            })
            continue
          }

          // Generar ID del médico
          const idBase = generateDoctorId(medicoPreparado.fullName)
          const doctorId = await ensureUniqueDoctorId(idBase)

          // Añadir timestamp e ID
          const medicoConMeta = {
            ...medicoPreparado,
            doctorId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }

          medicosValidos.push(medicoConMeta)
        } catch (error) {
          errores++
          listaErrores.push({
            medico: medico.fullName || "Médico sin nombre",
            error: error instanceof Error ? error.message : "Error desconocido",
          })
        }
      }

      // Añadir todos los médicos válidos al lote de escritura
      for (const medicoValido of medicosValidos) {
        const docRef = doc(collection(db, "doctors"))
        batch.set(docRef, medicoValido)
      }

      // Ejecutar el lote de escritura
      if (medicosValidos.length > 0) {
        await batch.commit()
        exitosos = medicosValidos.length
      }

      return {
        exito: errores === 0,
        mensaje: `Lote procesado: ${exitosos} éxitos, ${errores} errores.`,
        exitosos,
        errores,
        listaErrores,
      }
    } catch (error) {
      console.error("Error al procesar lote:", error)

      // Si falla el lote completo, intentar procesar uno por uno
      console.log("Intentando procesar médicos individualmente...")

      // Reiniciar contadores
      exitosos = 0
      errores = 0
      listaErrores.length = 0

      // Procesar cada médico individualmente
      for (const medico of lote) {
        try {
          // Preparar médico con valores predeterminados si es necesario
          const { valido, medicoPreparado, error } = prepararMedico(medico)

          if (!valido) {
            errores++
            listaErrores.push({
              medico: medico.fullName || "Médico sin nombre",
              error: error || "Error desconocido",
            })
            continue
          }

          // Generar ID del médico
          const idBase = generateDoctorId(medicoPreparado.fullName)
          const doctorId = await ensureUniqueDoctorId(idBase)

          // Añadir timestamp e ID
          const medicoConMeta = {
            ...medicoPreparado,
            doctorId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }

          // Guardar en Firestore individualmente
          const docRef = doc(collection(db, "doctors"))
          await writeBatch(db).set(docRef, medicoConMeta).commit()

          exitosos++
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
        mensaje: `Lote procesado individualmente: ${exitosos} éxitos, ${errores} errores.`,
        exitosos,
        errores,
        listaErrores,
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

      // Dividir los médicos en lotes según los tamaños configurados
      const lotes: any[][] = []
      let indiceInicio = 0

      // Crear lotes según los tamaños configurados
      for (let i = 0; i < tamanoLotes.length && indiceInicio < medicos.length; i++) {
        const tamanoLote = Math.min(tamanoLotes[i], FIRESTORE_BATCH_LIMIT)
        const indiceFin = Math.min(indiceInicio + tamanoLote, medicos.length)
        lotes.push(medicos.slice(indiceInicio, indiceFin))
        indiceInicio = indiceFin
      }

      // Si quedan médicos, crear lotes adicionales con el último tamaño configurado
      const ultimoTamanoLote = Math.min(tamanoLotes[tamanoLotes.length - 1], FIRESTORE_BATCH_LIMIT)
      while (indiceInicio < medicos.length) {
        const indiceFin = Math.min(indiceInicio + ultimoTamanoLote, medicos.length)
        lotes.push(medicos.slice(indiceInicio, indiceFin))
        indiceInicio = indiceFin
      }

      setTotalLotes(lotes.length)

      // Inicializar resultados
      let totalExitosos = 0
      let totalErrores = 0
      const todosErrores: { medico: string; error: string }[] = []

      // Procesar cada lote individualmente
      for (let i = 0; i < lotes.length; i++) {
        setLoteActual(i + 1)
        setProgresoSubida(Math.round(((i + 1) / lotes.length) * 100))

        const lote = lotes[i]

        // Mostrar información del lote actual
        toast({
          title: `Procesando lote ${i + 1} de ${lotes.length}`,
          description: `Tamaño del lote: ${lote.length} registros`,
        })

        // Procesar este lote
        const resultadoLote = await procesarLote(lote)

        // Agregar resultados
        totalExitosos += resultadoLote.exitosos
        totalErrores += resultadoLote.errores
        todosErrores.push(...resultadoLote.listaErrores)

        // Notificar resultado del lote
        toast({
          title: resultadoLote.exito ? "Lote procesado con éxito" : "Lote procesado con errores",
          description: `Lote ${i + 1}: ${resultadoLote.exitosos} éxitos, ${resultadoLote.errores} errores.`,
          variant: resultadoLote.exito ? "default" : "warning",
        })

        // Esperar entre lotes si no es el último
        if (i < lotes.length - 1) {
          await esperar(retrasoEntreLotes)
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

  // Exportar errores a CSV
  const exportarErroresCSV = () => {
    if (!resultado || resultado.listaErrores.length === 0) return

    // Crear contenido CSV
    const cabecera = "Médico,Error\n"
    const filas = resultado.listaErrores
      .map((error) => `"${error.medico.replace(/"/g, '""')}","${error.error.replace(/"/g, '""')}"`)
      .join("\n")

    const contenidoCSV = cabecera + filas

    // Crear blob y descargar
    const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `errores_carga_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Carga Masiva de Médicos</h1>
          <p className="text-muted-foreground">Sube múltiples registros de médicos a la vez.</p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}>
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </div>

      {mostrarConfiguracion && (
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Lotes</CardTitle>
            <CardDescription>Configura los tamaños de lotes para el procesamiento por etapas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tamano-lotes">Tamaños de lotes (separados por comas):</Label>
                <Input
                  id="tamano-lotes"
                  value={tamanoLotePersonalizado}
                  onChange={(e) => setTamanoLotePersonalizado(e.target.value)}
                  placeholder="400, 400, 400, 400"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ejemplo: "400, 400, 400, 400" procesará los primeros 400 registros, luego 400, etc.
                </p>
                {/* <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Nota: Firestore tiene un límite de {FIRESTORE_BATCH_LIMIT} documentos por operación de escritura por
                  lotes. Los valores mayores a {FIRESTORE_BATCH_LIMIT} serán ajustados automáticamente.
                </p> */}
              </div>

              <div>
                <Label htmlFor="retraso-lotes">Retraso entre lotes (ms):</Label>
                <Input
                  id="retraso-lotes"
                  type="number"
                  min="0"
                  max="10000"
                  value={retrasoEntreLotes}
                  onChange={(e) => setRetrasoEntreLotes(Number(e.target.value))}
                  className="mt-1 w-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tiempo de espera entre lotes en milisegundos. Recomendado: 1000-2000 ms para evitar límites de tasa.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ignorar-campos"
                  checked={ignorarCamposFaltantes}
                  onCheckedChange={setIgnorarCamposFaltantes}
                />
                <Label htmlFor="ignorar-campos">Ignorar campos faltantes</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Si está activado, los registros con campos faltantes se cargarán con valores predeterminados. Si está
                desactivado, los registros con campos faltantes se rechazarán.
              </p>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Configuración actual</AlertTitle>
                <AlertDescription>
                  <p>Tamaños de lotes: {tamanoLotes.join(", ")}</p>
                  <p>Retraso entre lotes: {retrasoEntreLotes} ms</p>
                  <p>Ignorar campos faltantes: {ignorarCamposFaltantes ? "Sí" : "No"}</p>
                  <p className="mt-1">
                    El último valor ({tamanoLotes[tamanoLotes.length - 1]}) se usará para los lotes restantes.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

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
                El sistema procesará los registros en lotes según la configuración establecida:
                {tamanoLotes.join(", ")} registros por lote.
              </p>
              <p className="mt-1">Retraso entre lotes: {retrasoEntreLotes} ms</p>
              <p className="mt-1">
                Modo de validación: {ignorarCamposFaltantes ? "Flexible (ignora campos faltantes)" : "Estricto"}
              </p>
              <p className="mt-1">Tamaño máximo recomendado: 4MB o 400 registros por carga.</p>
            </AlertDescription>
          </Alert>

          <div>
            <p className="text-sm text-muted-foreground my-4">
              El archivo debe contener un array de objetos, cada uno con los datos de un médico. Campos recomendados:
              Nombre completo, Número de licencia, Especialidades, enfocado en, Enfermedades tratadas, Ciudades, Números de teléfono.
              {ignorarCamposFaltantes && " Los campos faltantes se completarán con valores predeterminados."}
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
                placeholder='[{"fullName": "Dr. Juan Pérez", "licenseNumber": "12345", "specialties": ["Cardiología"], "focusedon": ["Arritmias"], "diseasesTreated": ["Síncope"], "cities": ["Monterrey"], "phoneNumbers": ["8112345678"]}]'
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
                    <Button variant="outline" size="sm" className="mt-2" onClick={exportarErroresCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar Errores a CSV
                    </Button>
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
