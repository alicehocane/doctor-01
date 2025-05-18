"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { trackSearch } from "@/lib/search-tracker"

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()
  const [searchType, setSearchType] = useState<string>("ciudad")
  const [searchValue, setSearchValue] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)

  // These would come from Firestore in a real implementation
  const ciudades = ["Ciudad de México", "Monterrey", "Guadalajara"]
  const especialidades = [
  "Acupuntor",
  "Alergología",
  "Alergólogo",
  "Algólogo",
  "Anatomía patológica",
  "Anatomopatólogo",
  "Anatomopatólogo",  
  "Angiología y cirugia vascular",
  "Angiólogo",
  "Anestesiología",
  "Anestesiólogo",
  "Audiología",
  "Audiólogo",
  "Cardiología",
  "Cardiólogo",
  "Cardiólogo pediátrico",
  "Cirugía cardiovascular y del tórax",
  "Cirujano cardiovascular y torácico",
  "Cirugía de la mano",
  "Cirujano de la mano",
  "Cirugía estética y cosmética",
  "Cirujano estético y cosmético",
  "Cirugía general",
  "Cirujano general",
  "Cirugía maxilofacial",
  "Cirujano maxilofacial",
  "Cirugía oncológica",
  "Cirujano oncólogo",
  "Cirugía pediátrica",
  "Cirujano pediátrico",
  "Cirugía plástica",
  "Cirujano plástico",
  "Cirugía plástica, estética y reconstructiva",
  "Cirujano plástico, estético y cosmético",
  "Dermatología",
  "Dermatólogo",
  "Dermatólogo pediátrico",
  "Diabetología",
  "Endocrinología",
  "Endocrinólogo",
  "Endocrinólogo pediátrico",
  "Endoscopia",
  "Endoscopista",
  "Enfermería",
  "Especialista en Medicina Crítica y Terapia Intensiva",
  "Especialista en Medicina del Trabajo",
  "Especialista en Obesidad y Delgadez",
  "Fisioterapeuta",
  "Fisioterapia",
  "Gastroenterología",
  "Gastroenterólogo",
  "Gastroenterología pediátrica",
  "Gastroenterólogo pediátrico",
  "Geriatría",
  "Geriatra",
  "Genética",
  "Ginecología y obstetricia",
  "Ginecólogo",
  "Ginecólogo oncológico",
  "Homeopatía",
  "Homeópata",
  "Hematología",
  "Inmunología",
  "Inmunólogo",
  "Infectología",
  "Internista",
  "Laboratorio-análisis clínicos",
  "Logopedia",
  "Medicina complementaria",
  "Medicina crítica y terapia intensiva",
  "Medicina del deporte",
  "Medicina estética",
  "Medicina familiar",
  "Medicina general",
  "Medicina integrada",
  "Medicina interna",
  "Medicina nuclear",
  "Medicina preventiva",
  "Medicina del trabajo",
  "Meditación",
  "Médico general",
  "Nefrología",
  "Nefrólogo",
  "Neurología",
  "Neurocirugía",
  "Neurofisiología",
  "Neurólogo",
  "Nutrición",
  "Nutriología clínica",
  "Obesidad y delgadez",
  "Odontología",
  "Odontólogo",
  "Oftalmología",
  "Oftalmólogo",
  "Oncología médica",
  "Ortopedia",
  "Ortopedista",
  "Otoneurología y foniatría",
  "Otorrinolaringología",
  "Otorrinolaringólogo",
  "Pediatría",
  "Pediatra",
  "Podología",
  "Podólogo",
  "Proctología",
  "Psiquiatría",
  "Psicoanálisis",
  "Psicología",
  "Radiología",
  "Rehabilitación y medicina física",
  "Reumatología",
  "Sexología",
  "Terapia del dolor",
  "Traumatología",
  "Urgencias",
  "Urgenciólogo",
  "Urología",
  "Urólogo",
  "Urólogo pediátrico",
  "estética y reconstructiva",
  "gerontologo",
  "otoneurología y foniatría",
  "Técnico en diagnóstico e imagen"
]
  const padecimientos = ["Hipertensión", "Diabetes", "Arritmias", "Asma", "Migraña", "Artritis", "Alergias"]

  const getOptionsForType = () => {
    switch (searchType) {
      case "ciudad":
        return ciudades
      case "especialidad":
        return especialidades
      case "padecimiento":
        return padecimientos
      default:
        return []
    }
  }

  const handleSearch = async () => {
    if (searchValue) {
      setIsSearching(true)

      try {
        // Track the search
        console.log(`Initiating search tracking: ${searchType} - ${searchValue}`)
        await trackSearch(searchType, searchValue)
        console.log("Search tracking completed")
      } catch (error) {
        console.error("Error tracking search:", error)
        // Continue with navigation even if tracking fails
      }

      // Navigate to search results
      router.push(`/buscar?tipo=${searchType}&valor=${searchValue}`)

      setIsSearching(false)
    }
  }

  return (
    <div className={`bg-card rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 items-end">
        <div className="w-full md:w-1/3">
          <label htmlFor="search-type" className="block text-sm font-medium mb-1">
            Buscar por
          </label>
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger id="search-type" className="w-full">
              <SelectValue placeholder="Selecciona tipo de búsqueda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ciudad">Ciudad</SelectItem>
              <SelectItem value="especialidad">Especialidad</SelectItem>
              <SelectItem value="padecimiento">Padecimiento Atendido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/2">
          <label htmlFor="search-value" className="block text-sm font-medium mb-1">
            {searchType === "ciudad"
              ? "Ciudad"
              : searchType === "especialidad"
                ? "Especialidad"
                : "Padecimiento Atendido"}
          </label>
          <Select value={searchValue} onValueChange={setSearchValue}>
            <SelectTrigger id="search-value" className="w-full">
              <SelectValue placeholder={`Selecciona ${searchType}`} />
            </SelectTrigger>
            <SelectContent>
              {getOptionsForType().map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} className="w-full md:w-auto" disabled={!searchValue || isSearching}>
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </div>
  )
}
