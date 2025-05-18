"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload, AlertCircle, CheckCircle, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { bulkUploadDoctors, processChunk } from "@/app/actions/bulk-upload-doctors"
import { Progress } from "@/components/ui/progress"

// Maximum number of records to process in a single chunk
const CHUNK_SIZE = 25

export default function BulkUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jsonData, setJsonData] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [dataSize, setDataSize] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentChunk, setCurrentChunk] = useState(0)
  const [totalChunks, setTotalChunks] = useState(0)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    totalProcessed: number
    successCount: number
    errorCount: number
    errors: { doctor: string; error: string }[]
  } | null>(null)

  // Calculate data size when JSON changes
  useEffect(() => {
    setDataSize(new Blob([jsonData]).size / 1024) // Size in KB
  }, [jsonData])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size before reading
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast({
        title: "Archivo demasiado grande",
        description: "El archivo no debe exceder los 10MB. Por favor, divida los datos en archivos más pequeños.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setJsonData(content)
    }
    reader.readAsText(file)
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

    // Validate JSON format before sending
    let parsedData
    try {
      parsedData = JSON.parse(jsonData)
      if (!Array.isArray(parsedData)) {
        toast({
          title: "Formato inválido",
          description: "El JSON debe ser un array de objetos",
          variant: "destructive",
        })
        return
      }

      // Show warning for large datasets
      if (parsedData.length > 500) {
        toast({
          title: "Conjunto de datos grande",
          description: `Está cargando ${parsedData.length} registros. La carga puede tardar varios minutos.`,
          variant: "warning",
        })
      }
    } catch (error) {
      toast({
        title: "JSON inválido",
        description: "El formato JSON no es válido",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setResult(null)
    setUploadProgress(0)

    try {
      // First validate the JSON format
      const initialValidation = await bulkUploadDoctors(jsonData)

      if (!initialValidation.success) {
        setResult(initialValidation)
        toast({
          title: "Error en la validación",
          description: initialValidation.message,
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }

      // Split data into chunks
      const chunks = []
      for (let i = 0; i < parsedData.length; i += CHUNK_SIZE) {
        chunks.push(parsedData.slice(i, i + CHUNK_SIZE))
      }

      setTotalChunks(chunks.length)

      // Process each chunk
      let totalSuccess = 0
      let totalErrors = 0
      const allErrors = []

      for (let i = 0; i < chunks.length; i++) {
        setCurrentChunk(i + 1)
        setUploadProgress(Math.round(((i + 1) / chunks.length) * 100))

        // Process this chunk
        const chunkResult = await processChunk(chunks[i])

        // Aggregate results
        totalSuccess += chunkResult.successCount
        totalErrors += chunkResult.errorCount
        allErrors.push(...chunkResult.errors)

        // Update progress after each chunk
        toast({
          title: "Progreso",
          description: `Procesado lote ${i + 1} de ${chunks.length}: ${chunkResult.successCount} éxitos, ${chunkResult.errorCount} errores`,
        })
      }

      // Final result
      const finalResult = {
        success: totalErrors === 0,
        message: `Se procesaron ${parsedData.length} registros. ${totalSuccess} médicos añadidos correctamente, ${totalErrors} errores.`,
        totalProcessed: parsedData.length,
        successCount: totalSuccess,
        errorCount: totalErrors,
        errors: allErrors,
      }

      setResult(finalResult)
      setUploadProgress(100)

      if (finalResult.success) {
        toast({
          title: "Carga exitosa",
          description: finalResult.message,
        })
      } else {
        toast({
          title: "Carga completada con errores",
          description: finalResult.message,
          variant: "warning",
        })
      }
    } catch (error) {
      console.error("Error uploading doctors:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la carga",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
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
          <div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Información importante</AlertTitle>
              <AlertDescription>
                <p>
                  Para conjuntos de datos grandes, el sistema procesará los registros en lotes de {CHUNK_SIZE} para
                  evitar errores de tamaño.
                </p>
                <p className="mt-1">Tamaño máximo recomendado: 10MB o 1000 registros por carga.</p>
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground my-4">
              El archivo debe contener un array de objetos, cada uno con los datos de un médico. Campos requeridos:
              fullName, licenseNumber, specialties, cities, phoneNumbers.
            </p>

            <div className="flex items-center gap-4 mb-4">
              <input type="file" accept=".json" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
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
                disabled={isUploading}
              />
              {dataSize > 0 && (
                <p className="text-xs text-muted-foreground">
                  Tamaño de datos: {dataSize.toFixed(2)} KB
                  {dataSize > 1000 && (
                    <span className="text-amber-500 ml-2">(Advertencia: conjunto de datos grande)</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <p className="text-sm">
                Procesando lote {currentChunk} de {totalChunks}...
              </p>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{uploadProgress}% completado</p>
            </div>
          )}

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Carga Exitosa" : "Error en la Carga"}</AlertTitle>
              <AlertDescription>
                <p>{result.message}</p>
                {result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Errores ({result.errors.length}):</p>
                    <div className="max-h-40 overflow-y-auto mt-1 border rounded p-2">
                      <ul className="list-disc pl-5 space-y-1">
                        {result.errors.map((error, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{error.doctor}:</span> {error.error}
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
          <Button variant="outline" onClick={() => router.back()} disabled={isUploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !jsonData.trim()}>
            {isUploading ? (
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

      {result?.success && (
        <div className="flex justify-end">
          <Button onClick={() => router.push("/admin/doctors")}>Ver Lista de Médicos</Button>
        </div>
      )}
    </div>
  )
}
