"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ContactForm() {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionIssue, setConnectionIssue] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "El asunto es obligatorio"
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setConnectionIssue(false)
    setSuccess(false)

    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Por favor, corrija los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    console.log("Form data to send:", formData)

    try {
      if (!db) {
        throw new Error("Firebase is not initialized")
      }

      // Add a timestamp to the form data
      const contactData = {
        ...formData,
        createdAt: serverTimestamp(),
      }

      // Add a timeout to detect potential blocking issues
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out - possible connection issue")), 5000),
      )

      // Save to Firestore
      const contactsRef = collection(db, "contacts")
      await Promise.race([addDoc(contactsRef, contactData), timeoutPromise])

      // Show success message
      setSuccess(true)
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos lo antes posible.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error: any) {
      console.error("Error sending contact form:", error)

      // Check if this might be a browser extension blocking issue
      if (error.message.includes("timeout") || error.code === "permission-denied" || error.name === "FirebaseError") {
        setConnectionIssue(true)
        setError(
          "Es posible que un bloqueador de anuncios o extensión del navegador esté impidiendo el envío del formulario.",
        )
      } else {
        setError(`Error al enviar el mensaje: ${error.message}`)
      }

      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {connectionIssue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Problema de conexión detectado</div>
            <p className="mt-1">
              Es posible que un bloqueador de anuncios o extensión de navegador esté impidiendo la conexión con
              Firebase. Intente desactivar extensiones o usar el modo incógnito.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Mensaje enviado con éxito. Gracias por contactarnos. Te responderemos lo antes posible.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Tu nombre completo"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="tu@correo.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Asunto</Label>
          <Select
            value={formData.subject}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, subject: value }))
              if (errors.subject) {
                setErrors((prev) => {
                  const newErrors = { ...prev }
                  delete newErrors.subject
                  return newErrors
                })
              }
            }}
          >
            <SelectTrigger id="subject">
              <SelectValue placeholder="Selecciona un asunto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consulta">Consulta General</SelectItem>
              <SelectItem value="soporte">Soporte Técnico</SelectItem>
              <SelectItem value="sugerencia">Sugerencia</SelectItem>
              <SelectItem value="registro">Registro de Médico</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Escribe tu mensaje aquí..."
            rows={5}
          />
          {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar Mensaje"}
        </Button>
      </form>
    </div>
  )
}
