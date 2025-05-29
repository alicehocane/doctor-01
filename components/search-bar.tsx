// components/search-bar.tsx
"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { trackSearch } from "@/lib/search-tracker"

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [searchBy, setSearchBy] = useState<"especialidad" | "padecimiento">(
    "especialidad"
  )
  const [searchValue, setSearchValue] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)

  // track how many chunks have been loaded per type
  const [loadMoreState, setLoadMoreState] = useState<{
    especialidad: number
    padecimiento: number
  }>({
    especialidad: 1,
    padecimiento: 1,
  })

  const ciudades = ["Ciudad de México", "Monterrey", "Guadalajara"]
  const allEspecialidades = [
    "Acupuntor",
    "Alergología",
    "Alergólogo",
    "Algólogo",
    "Anatomopatólogo",
    "Anatomía patológica",
    "Anestesiología",
    "Anestesiólogo",
    "Angiología y cirugía vascular",
    "Angiólogo",
    "Audiología",
    "Audiólogo",
    "Cardiología",
    // …etc
  ]
  const allPadecimientos = [
    "Abdomen agudo",
    "Abetalipoproteinemia",
    "Ablación de la placenta",
    "Aborto consumado",
    "Aborto electivo o terapéutico",
    "Aborto espontáneo",
    "Aborto incompleto",
    "Aborto inevitable",
    "Aborto séptico",
    "Aborto terapéutico",
    "Aboulomanía",
    "Abrupción placentaria",
    // …etc
  ]

  function getPaginatedOptions(type: "especialidad" | "padecimiento") {
    const all =
      type === "especialidad" ? allEspecialidades : allPadecimientos
    const chunk = loadMoreState[type]

    // increase slice by 50 options each time
    const limit = 50 * chunk
    if (limit >= all.length) return all
    return all.slice(0, limit)
  }

  function shouldShowLoadMore(type: "especialidad" | "padecimiento") {
    const all =
      type === "especialidad" ? allEspecialidades : allPadecimientos
    return all.length > 50 * loadMoreState[type]
  }

  function handleLoadMore(type: "especialidad" | "padecimiento") {
    setLoadMoreState((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
    setSearchValue("") // clear the current selection
  }

  const handleSearch = async () => {
    if (selectedCity && searchValue) {
      setIsSearching(true)
      try {
        await trackSearch(searchBy, searchValue)
        router.push(
          `/buscar?ciudad=${encodeURIComponent(
            selectedCity
          )}&tipo=${searchBy}&valor=${encodeURIComponent(searchValue)}`
        )
      } catch (error) {
        console.error("Error tracking search:", error)
      } finally {
        setIsSearching(false)
      }
    }
  }

  return (
    <div className={`bg-card rounded-lg shadow-sm p-4 ${className}`}>
      <div
        className={`flex gap-3 items-end ${
          selectedCity ? "flex-col md:flex-row" : "justify-center"
        }`}
      >
        {/* City selector */}
        <div className="w-full md:w-1/3">
          <label
            htmlFor="city"
            className="block text-sm font-medium mb-1"
          >
            Buscar en
          </label>
          <Select
            value={selectedCity}
            onValueChange={(val) => {
              setSelectedCity(val)
              setSearchValue("")
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

        {/* Search-by selector */}
        {selectedCity && (
          <div className="w-full md:w-1/3">
            <label
              htmlFor="search-by"
              className="block text-sm font-medium mb-1"
            >
              Buscar por
            </label>
            <Select
              value={searchBy}
              onValueChange={(val) => {
                setSearchBy(val)
                setSearchValue("")
              }}
            >
              <SelectTrigger id="search-by" className="w-full">
                <SelectValue placeholder="Tipo de búsqueda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especialidad">
                  Especialidad
                </SelectItem>
                <SelectItem value="padecimiento">
                  Padecimiento
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Value + “Ver más” pagination */}
        {selectedCity && (
          <div className="w-full md:w-1/3">
            <label
              htmlFor="search-value"
              className="block text-sm font-medium mb-1"
            >
              {searchBy === "especialidad"
                ? "Especialidad"
                : "Padecimiento"}
            </label>
            <Select
              value={searchValue}
              onValueChange={setSearchValue}
            >
              <SelectTrigger id="search-value" className="w-full">
                <SelectValue placeholder={`Selecciona ${searchBy}`} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {getPaginatedOptions(searchBy).map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}

                {shouldShowLoadMore(searchBy) && (
                  <div
                    className="relative flex items-center justify-center p-2 text-primary cursor-pointer hover:bg-accent"
                    onClick={(e) => {
                      e.preventDefault()
                      handleLoadMore(searchBy)
                    }}
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    {loadMoreState[searchBy] < 5
                      ? "Ver más"
                      : "Ver más allá"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Search button */}
        <Button
          onClick={handleSearch}
          className="w-full md:w-auto"
          disabled={!selectedCity || !searchValue || isSearching}
        >
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </div>
  )
}
