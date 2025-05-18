"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function FeaturedSections() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    especialidades: [] as string[],
    ciudades: [] as string[],
    padecimientos: [] as string[],
  })

  const [expandedSections, setExpandedSections] = useState({
    especialidades: false,
    ciudades: false,
    padecimientos: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const doctorsRef = collection(db, "doctors")
        const querySnapshot = await getDocs(doctorsRef)

        const allSpecialties = new Set<string>()
        const allCities = new Set<string>()
        const allDiseases = new Set<string>()

        querySnapshot.forEach((doc) => {
          const doctorData = doc.data()

          // Add specialties
          if (doctorData.specialties && Array.isArray(doctorData.specialties)) {
            doctorData.specialties.forEach((specialty: string) => allSpecialties.add(specialty))
          }

          // Add cities
          if (doctorData.cities && Array.isArray(doctorData.cities)) {
            doctorData.cities.forEach((city: string) => allCities.add(city))
          }

          // Add diseases
          if (doctorData.diseasesTreated && Array.isArray(doctorData.diseasesTreated)) {
            doctorData.diseasesTreated.forEach((disease: string) => allDiseases.add(disease))
          }
        })

        setData({
          especialidades: Array.from(allSpecialties).sort(),
          ciudades: Array.from(allCities).sort(),
          padecimientos: Array.from(allDiseases).sort(),
        })
      } catch (error) {
        console.error("Error fetching data for featured sections:", error)
        // Fallback to mock data
        setData({
          especialidades: [
            "Cardiólogo",
            "Pediatra",
            "Ginecólogo",
            "Dermatólogo",
            "Oftalmólogo",
            "Neurólogo",
            "Ortopedista",
            "Psiquiatra",
            "Endocrinólogo",
            "Gastroenterólogo",
          ],
          ciudades: [
            "Ciudad de México",
            "Monterrey",
            "Guadalajara",
            "Puebla",
            "Tijuana",
            "Cancún",
            "Mérida",
            "Querétaro",
            "León",
            "Toluca",
          ],
          padecimientos: [
            "Hipertensión",
            "Diabetes",
            "Arritmias",
            "Asma",
            "Migraña",
            "Artritis",
            "Alergias",
            "Depresión",
            "Ansiedad",
            "Obesidad",
            "Hipotiroidismo",
            "Gastritis",
            "Colitis",
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const renderItems = (items: string[], section: string, expanded: boolean) => {
    const displayItems = expanded ? items : items.slice(0, 7)

    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-8 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {displayItems.map((item) => (
          <Link
            key={item}
            href={`/buscar?tipo=${section === "especialidades" ? "especialidad" : section === "ciudades" ? "ciudad" : "padecimiento"}&valor=${item}`}
            className="text-sm hover:text-primary transition-colors p-2 rounded-md hover:bg-accent"
          >
            {item}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Especialidades</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => toggleSection("especialidades")} className="h-8 px-2">
            {expandedSections.especialidades ? (
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
        </CardHeader>
        <CardContent>{renderItems(data.especialidades, "especialidades", expandedSections.especialidades)}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Ciudades</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => toggleSection("ciudades")} className="h-8 px-2">
            {expandedSections.ciudades ? (
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
        </CardHeader>
        <CardContent>{renderItems(data.ciudades, "ciudades", expandedSections.ciudades)}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Padecimientos Atendidos</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => toggleSection("padecimientos")} className="h-8 px-2">
            {expandedSections.padecimientos ? (
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
        </CardHeader>
        <CardContent>{renderItems(data.padecimientos, "padecimientos", expandedSections.padecimientos)}</CardContent>
      </Card>
    </div>
  )
}
