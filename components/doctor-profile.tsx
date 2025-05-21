"use client"

import { useState, useEffect } from "react"
import { Phone, MapPin, User, Award, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface DoctorProfileProps {
  id: string
}

export default function DoctorProfile({ id }: DoctorProfileProps) {
  const [doctor, setDoctor] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({
    specialties: false,
    diseases: false,
    phones: false,
    addresses: false,
  })

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true)
      try {
        const docRef = doc(db, "doctors", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setDoctor({
            id: docSnap.id,
            ...docSnap.data(),
          })
        } else {
          setDoctor(null)
        }
      } catch (error) {
        console.error("Error fetching doctor:", error)
        // Fallback to mock data for demo purposes
        const mockDoctors = [
          {
            id: "WDONFz7u8gQm5Sslxd43",
            fullName: "Dr. Luis Felipe Aguilar Aguilar",
            licenseNumber: "12278122 9821017",
            specialties: ["Cardiólogo", "Angiólogo"],
            focusedon: ["Hemodinamia", "Cardiólogo Intervencionista", "Cardiología clínica"],
            diseasesTreated: [
              "Arritmias",
              "Hipertensión",
              "Insuficiencia cardíaca",
              "Fibrilación auricular",
              "Angina",
              "Cardiomiopatía isquémica",
              "Bradicardia",
              "Cardiopatía hipertensiva",
              "Infarto de miocardio",
              "Enfermedad coronaria (CHD)",
              "Taquicardia",
              "Síncope",
              "Síndrome de oclusión de la arteria carótida",
            ],
            cities: ["Monterrey", "Guadalajara"],
            addresses: [
              "Centro Médico Hidalgo - Consultorio 205, Miguel Hidalgo y Costilla 2425, Monterrey",
              "Christus Muguerza Hospital Cumbres - Consultorio 504, Paseo de los Leones 8001, Monterrey",
            ],
            phoneNumbers: ["8117331493", "8140589516"],
          },
        ]
        const foundDoctor = mockDoctors.find((doc) => doc.id === id)
        setDoctor(foundDoctor || null)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [id])

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`
    }
    return phone
  }

  if (loading) {
    return <DoctorProfileSkeleton />
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Médico no encontrado</h2>
        <p className="text-muted-foreground">No se encontró información para el médico solicitado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{doctor.fullName}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.specialties.map((specialty: string) => (
              <Badge key={specialty} variant="outline">
                {specialty}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Cédula Profesional:</span>
            <span>{doctor.licenseNumber}</span>
          </div>

          {doctor.focusedon && doctor.focusedon.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Award className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-muted-foreground block">Enfocado en:</span>
              <span>{doctor.focusedon.join(", ")}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specialties Section */}
      {doctor.specialties.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Especialidades</CardTitle>
            {doctor.specialties.length > 2 && (
              <Button variant="ghost" size="sm" onClick={() => toggleSection("specialties")} className="h-8 px-2">
                {expanded.specialties ? (
                  <>
                    <span className="mr-1">Ver menos</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span className="mr-1">Ver más</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(expanded.specialties ? doctor.specialties : doctor.specialties.slice(0, 2)).map((specialty: string) => (
                <div key={specialty} className="flex items-center gap-2 p-2 rounded-md bg-accent/50">
                  <Award className="h-4 w-4 text-primary" />
                  <span>{specialty}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diseases Treated Section */}
      {doctor.diseasesTreated.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Padecimientos Atendidos</CardTitle>
            {doctor.diseasesTreated.length > 12 && (
              <Button variant="ghost" size="sm" onClick={() => toggleSection("diseases")} className="h-8 px-2">
                {expanded.diseases ? (
                  <>
                    <span className="mr-1">Ver menos</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span className="mr-1">Ver más</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(expanded.diseases ? doctor.diseasesTreated : doctor.diseasesTreated.slice(0, 12)).map(
                (disease: string) => (
                  <Badge key={disease} variant="secondary">
                    {disease}
                  </Badge>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phone Numbers */}
          {doctor.phoneNumbers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Teléfonos</h3>
                {doctor.phoneNumbers.length > 3 && (
                  <Button variant="ghost" size="sm" onClick={() => toggleSection("phones")} className="h-8 px-2">
                    {expanded.phones ? (
                      <>
                        <span className="mr-1">Ver menos</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span className="mr-1">Ver más</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {(expanded.phones ? doctor.phoneNumbers : doctor.phoneNumbers.slice(0, 3)).map((phone: string) => (
                  <div key={phone} className="flex justify-between items-center p-2 rounded-md bg-accent/50">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{formatPhoneNumber(phone)}</span>
                    </div>
                    <Button size="sm" asChild>
                      <a href={`tel:${phone}`}>Llamar</a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addresses */}
          {doctor.addresses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Direcciones</h3>
                {doctor.addresses.length > 2 && (
                  <Button variant="ghost" size="sm" onClick={() => toggleSection("addresses")} className="h-8 px-2">
                    {expanded.addresses ? (
                      <>
                        <span className="mr-1">Ver menos</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span className="mr-1">Ver más</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {(expanded.addresses ? doctor.addresses : doctor.addresses.slice(0, 2)).map(
                  (address: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-md bg-accent/50">
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{address}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Cities */}
          {doctor.cities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Ciudades</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.cities.map((city: string) => (
                  <Badge key={city} variant="outline">
                    {city}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DoctorProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-64" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-24" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
