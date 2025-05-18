"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Upload, Download, FileJson, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function JsonSplitterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jsonData, setJsonData] = useState("")
  const [chunkSize, setChunkSize] = useState(10)
  const [splitFiles, setSplitFiles] = useState<{ name: string; content: string }[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size before reading
    if (file.size > 20 * 1024 * 1024) {
      // 20MB limit
      toast({
        title: "File too large",
        description: "The file should not exceed 20MB. Please use a smaller file.",
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

  const handleSplit = () => {
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

    const doctors = validation.data
    const totalDoctors = doctors.length
    const totalChunks = Math.ceil(totalDoctors / chunkSize)

    // Split the data into chunks
    const chunks: { name: string; content: string }[] = []
    for (let i = 0; i < totalChunks; i++) {
      const startIndex = i * chunkSize
      const endIndex = Math.min(startIndex + chunkSize, totalDoctors)
      const chunk = doctors.slice(startIndex, endIndex)

      chunks.push({
        name: `doctors_${i + 1}_of_${totalChunks}.json`,
        content: JSON.stringify(chunk, null, 2),
      })
    }

    setSplitFiles(chunks)

    toast({
      title: "JSON Split Complete",
      description: `Split into ${chunks.length} files with ${chunkSize} records each.`,
    })
  }

  const downloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAllFiles = () => {
    // Create a zip file using JSZip
    import("jszip").then((JSZip) => {
      const zip = new JSZip.default()

      // Add each file to the zip
      splitFiles.forEach((file) => {
        zip.file(file.name, file.content)
      })

      // Generate the zip file
      zip.generateAsync({ type: "blob" }).then((content) => {
        // Create a download link
        const url = URL.createObjectURL(content)
        const a = document.createElement("a")
        a.href = url
        a.download = "doctors_split_files.zip"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">JSON File Splitter</h1>
          <p className="text-muted-foreground">Split large JSON files into smaller chunks for easier uploading.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Split JSON File</CardTitle>
          <CardDescription>Upload a large JSON file and split it into smaller files.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <FileJson className="h-4 w-4" />
            <AlertTitle>How to use this tool</AlertTitle>
            <AlertDescription>
              <p>
                1. Upload your large JSON file or paste the content
                <br />
                2. Set the number of records per file
                <br />
                3. Click "Split JSON" to generate smaller files
                <br />
                4. Download individual files or all files as a ZIP
                <br />
                5. Upload each small file using the bulk upload tool
              </p>
            </AlertDescription>
          </Alert>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <input type="file" accept=".json" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
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
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="chunk-size">Records per file:</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="chunk-size"
                  type="number"
                  min="1"
                  max="100"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number.parseInt(e.target.value) || 10)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  (Recommended: 10-20 records per file to avoid size errors)
                </span>
              </div>
            </div>
          </div>

          {splitFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Split Files ({splitFiles.length})</h3>
                <Button onClick={downloadAllFiles} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download All as ZIP
                </Button>
              </div>
              <div className="border rounded-md">
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="text-left p-2">File Name</th>
                        <th className="text-right p-2">Size</th>
                        <th className="text-right p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {splitFiles.map((file, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{file.name}</td>
                          <td className="text-right p-2">{(file.content.length / 1024).toFixed(2)} KB</td>
                          <td className="text-right p-2">
                            <Button variant="ghost" size="sm" onClick={() => downloadFile(file.name, file.content)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSplit} disabled={!jsonData.trim()}>
            <Scissors className="mr-2 h-4 w-4" />
            Split JSON
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
