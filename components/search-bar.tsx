"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { trackSearch } from "@/lib/search-tracker"

// Constant values
const ciudades = ["Ciudad de México", "Monterrey", "Guadalajara"]
const allEspecialidades = [
  "Acupuntor",
  "Alergología",
  "Alergólogo",
  "Algólogo",
  "Anatomopatólogo",
  "Anatomía patológica"
]
const allPadecimientos = [
  "Abdomen agudo",
  "Abetalipoproteinemia",
  "Ablación de la placenta",
  "Aborto consumado",
  "Aborto electivo o terapéutico",
  "Aborto espontáneo",
  "Aborto incompleto"
]

// Mock data mapping (city to specialties/diseases)
const citySpecialties: Record<string, string[]> = {
  "Ciudad de México": ["Alergología", "Anatomía patológica"],
  "Monterrey": ["Acupuntor", "Alergólogo", "Anatomopatólogo"],
  "Guadalajara": ["Algólogo", "Anatomía patológica"]
}

const cityDiseases: Record<string, string[]> = {
  "Ciudad de México": ["Abdomen agudo", "Abetalipoproteinemia"],
  "Monterrey": ["Ablación de la placenta", "Aborto consumado", "Aborto electivo o terapéutico"],
  "Guadalajara": ["Aborto espontáneo", "Aborto incompleto"]
}

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [searchBy, setSearchBy] = useState<"especialidad" | "enfermedad">("especialidad")
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)

  // Get filtered options based on selected city
  const getFilteredOptions = () => {
    if (!selectedCity) return []
    
    if (searchBy === "especialidad") {
      return citySpecialties[selectedCity] || []
    } else {
      return cityDiseases[selectedCity] || []
    }
  }

  const handleSearch = async () => {
    if ((!selectedCity) || (!selectedOption)) return
    
    setIsSearching(true)
    try {
      await trackSearch(
        searchBy === "especialidad" ? "specialty" : "disease",
        selectedOption,
        selectedCity
      )
      
      router.push(
        `/buscar?ciudad=${encodeURIComponent(selectedCity)}&` +
        `${searchBy}=${encodeURIComponent(selectedOption)}`
      )
    } catch (error) {
      console.error("Error tracking search:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className={`bg-card rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex flex-col gap-4">
        {/* First Dropdown - City Selection (Required) */}
        <div className="w-full">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Buscar en (Ciudad)
          </label>
          <Select 
            value={selectedCity} 
            onValueChange={(value) => {
              setSelectedCity(value)
              setSelectedOption("") // Reset option when city changes
            }}
          >
            <SelectTrigger id="city" className="w-full">
              <SelectValue placeholder="Selecciona una ciudad" />
            </SelectTrigger>
            <SelectContent>
              {ciudades.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Second Dropdown - Search By (Required) */}
        <div className="w-full">
          <label htmlFor="search-by" className="block text-sm font-medium mb-1">
            Buscar por
          </label>
          <Select 
            value={searchBy} 
            onValueChange={(value: "especialidad" | "enfermedad") => {
              setSearchBy(value)
              setSelectedOption("") // Reset option when search type changes
            }}
            disabled={!selectedCity}
          >
            <SelectTrigger id="search-by" className="w-full">
              <SelectValue placeholder="Selecciona tipo de búsqueda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="especialidad">Especialidad</SelectItem>
              <SelectItem value="enfermedad">Enfermedad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Third Dropdown - Dynamic Options */}
        <div className="w-full">
          <label htmlFor="search-option" className="block text-sm font-medium mb-1">
            {searchBy === "especialidad" ? "Especialidad" : "Enfermedad"}
          </label>
          <Select 
            value={selectedOption} 
            onValueChange={setSelectedOption}
            disabled={!selectedCity}
          >
            <SelectTrigger id="search-option" className="w-full">
              <SelectValue 
                placeholder={
                  `Selecciona ${searchBy === "especialidad" ? "una especialidad" : "una enfermedad"}`
                } 
              />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {getFilteredOptions().map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSearch} 
          className="w-full" 
          disabled={!selectedCity || !selectedOption || isSearching}
        >
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </div>
  )
}