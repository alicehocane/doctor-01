"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Static data for featured sections
const FEATURED_DATA = {
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
}

export default function FeaturedSections() {
  const [expandedSections, setExpandedSections] = useState({
    especialidades: false,
    ciudades: false,
    padecimientos: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const renderItems = (items: string[], section: string, expanded: boolean) => {
    const displayItems = expanded ? items : items.slice(0, 8)

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
        <CardContent>
          {renderItems(FEATURED_DATA.especialidades, "especialidades", expandedSections.especialidades)}
        </CardContent>
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
        <CardContent>{renderItems(FEATURED_DATA.ciudades, "ciudades", expandedSections.ciudades)}</CardContent>
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
        <CardContent>
          {renderItems(FEATURED_DATA.padecimientos, "padecimientos", expandedSections.padecimientos)}
        </CardContent>
      </Card>
    </div>
  )
}