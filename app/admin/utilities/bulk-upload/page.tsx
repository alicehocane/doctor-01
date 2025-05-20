"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { bulkUploadDoctors } from "@/app/actions/bulk-upload-doctors"

export default function BulkUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jsonData, setJsonData] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    totalProcessed: number
    successCount: number
    errorCount: number
    errors: { doctor: string; error: string }[]
  } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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

    setIsUploading(true)
    setResult(null)

    try {
      const result = await bulkUploadDoctors(jsonData)
      setResult(result)

      if (result.success) {
        toast({
          title: "Carga exitosa",
          description: result.message,
        })
      } else {
        toast({
          title: "Error en la carga",
          description: result.message,
          variant: "destructive",
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
            <p className="text-sm text-muted-foreground mb-2">
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
            </div>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Carga Exitosa" : "Error en la Carga"}</AlertTitle>
              <AlertDescription>
                <p>{result.message}</p>
                {result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Errores:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {result.errors.map((error, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">{error.doctor}:</span> {error.error}
                        </li>
                      ))}
                    </ul>
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
