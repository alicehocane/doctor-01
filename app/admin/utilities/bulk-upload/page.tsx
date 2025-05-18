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

export default function BulkUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jsonData, setJsonData] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentDoctor, setCurrentDoctor] = useState(0)
  const [totalDoctors, setTotalDoctors] = useState(0)
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

    // Check file size before reading
    if (file.size > 20 * 1024 * 1024) {
      // 20MB limit
      toast({
        title: "File too large",
        description: "The file should not exceed 20MB. Please split the data into smaller files.",
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

  // Validate JSON format
  const validateJson = (jsonString: string): { valid: boolean; message: string; data?: any[] } => {
    try {
      const parsed = JSON.parse(jsonString)
      if (!Array.isArray(parsed)) {
        return {
          valid: false,
          message: "Invalid JSON format. An array of objects was expected.",
        }
      }
      return { valid: true, message: "Valid JSON", data: parsed }
    } catch (error) {
      return {
        valid: false,
        message: "Error parsing JSON: " + (error instanceof Error ? error.message : "Unknown error"),
      }
    }
  }

  // Process a single doctor
  const processSingleDoctor = async (
    doctor: any,
  ): Promise<{
    success: boolean
    message: string
    doctorId?: string
    error?: string
  }> => {
    try {
      const response = await fetch("/api/doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctor),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error processing doctor:", error)
      return {
        success: false,
        message: "Error processing doctor",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const handleUpload = async () => {
    if (!jsonData.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON data or upload a file",
        variant: "destructive",
      })
      return
    }

    // Validate JSON format first
    const validation = validateJson(jsonData)
    if (!validation.valid || !validation.data) {
      toast({
        title: "Invalid JSON",
        description: validation.message,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setResult(null)
    setUploadProgress(0)

    try {
      const doctors = validation.data
      setTotalDoctors(doctors.length)

      // Initialize results
      let successCount = 0
      let errorCount = 0
      const errors: { doctor: string; error: string }[] = []

      // Process each doctor individually
      for (let i = 0; i < doctors.length; i++) {
        setCurrentDoctor(i + 1)
        setUploadProgress(Math.round(((i + 1) / doctors.length) * 100))

        // Process this doctor - one at a time to avoid payload size issues
        const doctorResult = await processSingleDoctor(doctors[i])

        // Aggregate results
        if (doctorResult.success) {
          successCount++
        } else {
          errorCount++
          errors.push({
            doctor: doctors[i].fullName || "Unnamed doctor",
            error: doctorResult.error || "Unknown error",
          })
        }

        // Update progress every 10 doctors or for the last one
        if (i % 10 === 0 || i === doctors.length - 1) {
          toast({
            title: "Progress",
            description: `Processed ${i + 1} of ${doctors.length} doctors`,
          })
        }
      }

      // Final result
      const finalResult = {
        success: errorCount === 0,
        message: `Processed ${doctors.length} records. ${successCount} doctors added successfully, ${errorCount} errors.`,
        totalProcessed: doctors.length,
        successCount,
        errorCount,
        errors,
      }

      setResult(finalResult)

      if (finalResult.success) {
        toast({
          title: "Upload successful",
          description: finalResult.message,
        })
      } else {
        toast({
          title: "Upload completed with errors",
          description: `${successCount} doctors added, ${errorCount} errors.`,
          variant: "warning",
        })
      }
    } catch (error) {
      console.error("Error uploading doctors:", error)
      toast({
        title: "Error",
        description:
          "An error occurred while processing the upload: " +
          (error instanceof Error ? error.message : "Unknown error"),
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
          Back
        </Button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Bulk Upload Doctors</h1>
          <p className="text-muted-foreground">Upload multiple doctor records at once.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload JSON Data</CardTitle>
          <CardDescription>Upload a JSON file or directly paste the JSON content with doctor data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              <p>
                To avoid size errors, the system will process records one by one. This process may take longer, but it's
                more reliable for large datasets.
              </p>
              <p className="mt-1">Maximum recommended size: 20MB or 2000 records per upload.</p>
            </AlertDescription>
          </Alert>

          <div>
            <p className="text-sm text-muted-foreground my-4">
              The file must contain an array of objects, each with doctor data. Required fields: fullName,
              licenseNumber, specialties, cities, phoneNumbers.
            </p>

            <div className="flex items-center gap-4 mb-4">
              <input type="file" accept=".json" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                Select JSON File
              </Button>
              <span className="text-sm text-muted-foreground">
                {fileInputRef.current?.files?.[0]?.name || "No file selected"}
              </span>
            </div>

            <div className="space-y-2">
              <label htmlFor="json-data" className="text-sm font-medium">
                Or paste JSON content directly:
              </label>
              <Textarea
                id="json-data"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder='[{"fullName": "Dr. John Smith", "licenseNumber": "12345", "specialties": ["Cardiology"], "cities": ["New York"], "phoneNumbers": ["1234567890"]}]'
                className="min-h-[200px] font-mono text-sm"
                disabled={isUploading}
              />
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <p className="text-sm">
                Processing doctor {currentDoctor} of {totalDoctors}...
              </p>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{uploadProgress}% completed</p>
            </div>
          )}

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Upload Successful" : "Upload Error"}</AlertTitle>
              <AlertDescription>
                <p>{result.message}</p>
                {result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Errors ({result.errors.length}):</p>
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
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !jsonData.trim()}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Doctors
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {result?.success && (
        <div className="flex justify-end">
          <Button onClick={() => router.push("/admin/doctors")}>View Doctors List</Button>
        </div>
      )}
    </div>
  )
}
