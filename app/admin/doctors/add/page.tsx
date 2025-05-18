"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { logActivity } from "@/lib/activity-logger"

export default function AddDoctor() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    licenseNumber: "",
    specialties: [] as string[],
    focusedon: [] as string[],
    diseasesTreated: [] as string[],
    cities: [] as string[],
    addresses: [] as string[],
    phoneNumbers: [] as string[],
  })

  const [newItem, setNewItem] = useState({
    specialty: "",
    focuson: "",
    disease: "",
    city: "",
    address: "",
    phoneNumber: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
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

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const addItemToArray = (field: keyof typeof formData, value: string) => {
    if (!value.trim()) return

    if (Array.isArray(formData[field])) {
      // Check if item already exists
      if ((formData[field] as string[]).includes(value)) {
        setErrors((prev) => ({
          ...prev,
          [field]: `Este elemento ya existe en la lista`,
        }))
        return
      }

      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }))

      // Clear the input field
      const inputField =
        field === "specialties"
          ? "specialty"
          : field === "focusedon"
            ? "focuson"
            : field === "diseasesTreated"
              ? "disease"
              : field === "cities"
                ? "city"
                : field === "addresses"
                  ? "address"
                  : "phoneNumber"

      setNewItem((prev) => ({ ...prev, [inputField]: "" }))

      // Clear any errors for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }
  }

  const removeItemFromArray = (field: keyof typeof formData, index: number) => {
    if (Array.isArray(formData[field])) {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre es obligatorio"
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "La cédula profesional es obligatoria"
    }

    if (formData.specialties.length === 0) {
      newErrors.specialties = "Debe agregar al menos una especialidad"
    }

    if (formData.cities.length === 0) {
      newErrors.cities = "Debe agregar al menos una ciudad"
    }

    if (formData.phoneNumbers.length === 0) {
      newErrors.phoneNumbers = "Debe agregar al menos un número de teléfono"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setConnectionIssue(false)

    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Por favor, corrija los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    console.log("Form data to save:", formData)

    try {
      if (!db) {
        throw new Error("Firestore is not initialized")
      }

      // Add a new document to the "doctors" collection
      const doctorsRef = collection(db, "doctors")

      // Add a timeout to detect potential blocking issues
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out - possible connection issue")), 5000),
      )

      // Race between the actual request and the timeout
      const docData = {
        ...formData,
        createdAt: new Date(),
      }

      console.log("Adding doctor to Firestore...")
      const docRef = await Promise.race([addDoc(collection(db, "doctors"), docData), timeoutPromise])
      console.log("Doctor added with ID:", docRef.id)

      // Log the activity
      console.log("Logging activity for new doctor...")
      const activityId = await logActivity({
        type: "add",
        description: `Nuevo médico agregado: ${formData.fullName}`,
        entityId: docRef.id,
        entityType: "doctor",
      })
      console.log("Activity logged with ID:", activityId)

      toast({
        title: "Médico agregado",
        description: "El médico ha sido agregado exitosamente",
      })

      // Redirect to doctors list
      router.push("/admin/doctors")
    } catch (error: any) {
      console.error("Error adding doctor:", error)

      // Check if this might be a browser extension blocking issue
      if (error.message.includes("timeout") || error.code === "permission-denied" || error.name === "FirebaseError") {
        setConnectionIssue(true)
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con la base de datos. Posible bloqueo por extensión del navegador.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo agregar el médico. " + error.message,
          variant: "destructive",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* <Button variant="ghost" onClick={() => router.back()} className="hidden sm:flex">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button> */}

        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Agregar Médico</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Ingresa la información del nuevo médico.</p>
        </div>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Dr. Juan Pérez González"
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Cédula Profesional</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="12345678 9876543"
                />
                {errors.licenseNumber && <p className="text-sm text-destructive">{errors.licenseNumber}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Especialidades y Enfoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Especialidades</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {specialty}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeItemFromArray("specialties", index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  name="specialty"
                  value={newItem.specialty}
                  onChange={handleNewItemChange}
                  placeholder="Ej. Cardiólogo"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addItemToArray("specialties", newItem.specialty)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {errors.specialties && <p className="text-sm text-destructive">{errors.specialties}</p>}
            </div>

            <div className="space-y-4">
              <Label>Enfocado en</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.focusedon.map((focus, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {focus}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeItemFromArray("focusedon", index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  name="focuson"
                  value={newItem.focuson}
                  onChange={handleNewItemChange}
                  placeholder="Ej. Cardiología clínica"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addItemToArray("focusedon", newItem.focuson)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Padecimientos Atendidos</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.diseasesTreated.map((disease, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {disease}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeItemFromArray("diseasesTreated", index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  name="disease"
                  value={newItem.disease}
                  onChange={handleNewItemChange}
                  placeholder="Ej. Hipertensión"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addItemToArray("diseasesTreated", newItem.disease)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicación y Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Ciudades</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.cities.map((city, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {city}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeItemFromArray("cities", index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  name="city"
                  value={newItem.city}
                  onChange={handleNewItemChange}
                  placeholder="Ej. Monterrey"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addItemToArray("cities", newItem.city)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {errors.cities && <p className="text-sm text-destructive">{errors.cities}</p>}
            </div>

            <div className="space-y-4">
              <Label>Direcciones</Label>
              <div className="space-y-2 mb-2">
                {formData.addresses.map((address, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-accent rounded-md">
                    <span className="flex-1 text-sm">{address}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeItemFromArray("addresses", index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <Textarea
                  name="address"
                  value={newItem.address}
                  onChange={handleNewItemChange}
                  placeholder="Ej. Centro Médico - Consultorio 205, Av. Principal 123, Ciudad"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => addItemToArray("addresses", newItem.address)}
                  className="self-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Teléfonos</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.phoneNumbers.map((phone, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {phone}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeItemFromArray("phoneNumbers", index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  name="phoneNumber"
                  value={newItem.phoneNumber}
                  onChange={handleNewItemChange}
                  placeholder="Ej. 8112345678"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addItemToArray("phoneNumbers", newItem.phoneNumber)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              {errors.phoneNumbers && <p className="text-sm text-destructive">{errors.phoneNumbers}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()} className="order-2 sm:order-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting} className="order-1 sm:order-2">
            {submitting ? "Guardando..." : "Guardar Médico"}
          </Button>
        </div>
      </form>
    </div>
  )
}
