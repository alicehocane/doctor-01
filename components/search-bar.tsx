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
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [searchBy, setSearchBy] = useState<"especialidad" | "padecimiento">("especialidad")
  const [searchValue, setSearchValue] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)

  // Hardcoded values
  const ciudades = ["Ciudad de México", "Monterrey", "Guadalajara"]
  const allEspecialidades = [
    "Acupuntor", "Alergología", "Alergólogo", "Algólogo", 
    "Anatomopatólogo", "Anatomía patológica", "Cardiólogo", "Angiólogo"
  ]
  const allPadecimientos = [
    "Abdomen agudo", "Abetalipoproteinemia", "Ablación de la placenta",
    "Arritmias", "Hipertensión", "Insuficiencia cardíaca", "Fibrilación auricular"
  ]

  const handleSearch = async () => {
    if (selectedCity && searchValue) {
      setIsSearching(true)
      try {
        await trackSearch(searchBy, searchValue)
        router.push(`/buscar?ciudad=${selectedCity}&tipo=${searchBy}&valor=${searchValue}`)
      } catch (error) {
        console.error("Error tracking search:", error)
      } finally {
        setIsSearching(false)
      }
    }
  }

  return (
    <div className={`bg-card rounded-lg shadow-sm p-4 ${className}`}>
      <div className={`flex flex-col md:flex-row gap-3 ${selectedCity ? 'items-end' : 'items-center'}`}>
        {/* First Dropdown - City */}
        <div className={`w-full transition-all duration-200 ${
          selectedCity ? 'md:w-1/3' : 'md:w-full md:max-w-md mx-auto text-center'
        }`}>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Buscar en (Search in)
          </label>
          <Select 
            value={selectedCity} 
            onValueChange={(value) => {
              setSelectedCity(value)
              setSearchValue("")
            }}
          >
            <SelectTrigger id="city" className={`w-full ${!selectedCity ? 'md:max-w-xs mx-auto' : ''}`}>
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

        {/* Second Dropdown - Search by */}
        {selectedCity && (
          <div className="w-full md:w-1/3 transition-all duration-200">
            <label htmlFor="search-by" className="block text-sm font-medium mb-1">
              Buscar por (Search by)
            </label>
            <Select 
              value={searchBy} 
              onValueChange={(value: "especialidad" | "padecimiento") => {
                setSearchBy(value)
                setSearchValue("")
              }}
            >
              <SelectTrigger id="search-by" className="w-full">
                <SelectValue placeholder="Selecciona tipo de búsqueda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especialidad">Especialidad</SelectItem>
                <SelectItem value="padecimiento">Padecimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Third Dropdown - Specialties/Diseases */}
        {selectedCity && searchBy && (
          <div className="w-full md:w-1/3 transition-all duration-200">
            <label htmlFor="search-value" className="block text-sm font-medium mb-1">
              {searchBy === "especialidad" ? "Especialidad" : "Padecimiento"}
            </label>
            <Select value={searchValue} onValueChange={setSearchValue}>
              <SelectTrigger id="search-value" className="w-full">
                <SelectValue placeholder={`Selecciona ${searchBy}`} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {(searchBy === "especialidad" ? allEspecialidades : allPadecimientos).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Search Button */}
        <Button 
          onClick={handleSearch} 
          className={`w-full transition-all duration-200 ${
            selectedCity && searchBy ? 'md:w-auto' : 'md:w-full md:max-w-xs'
          }`} 
          disabled={!selectedCity || !searchValue || isSearching}
        >
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </div>
  )
}