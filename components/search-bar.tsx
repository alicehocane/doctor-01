"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { trackSearch } from "@/lib/search-tracker"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase" // Make sure you have your Firebase config setup

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [searchBy, setSearchBy] = useState<string>("")
  const [searchValue, setSearchValue] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  const [loadMoreState, setLoadMoreState] = useState<{
    especialidad: number
    padecimiento: number
  }>({ especialidad: 1, padecimiento: 1 })

  // State for Firestore data
  const [ciudades, setCiudades] = useState<string[]>([])
  const [especialidades, setEspecialidades] = useState<string[]>([])
  const [padecimientos, setPadecimientos] = useState<string[]>([])

  // Fetch cities from Firestore on component mount
  useEffect(() => {
    const fetchCities = async () => {
      const citiesSnapshot = await getDocs(collection(db, "cities"))
      const citiesList = citiesSnapshot.docs.map(doc => doc.data().name)
      setCiudades(citiesList)
    }

    fetchCities()
  }, [])

  // Fetch specialties or diseases based on city selection
  useEffect(() => {
    if (!selectedCity) return

    const fetchData = async () => {
      // Fetch specialties
      const specialtiesQuery = query(
        collection(db, "doctors"),
        where("city", "==", selectedCity)
      )
      const specialtiesSnapshot = await getDocs(specialtiesQuery)
      
      const specialties = new Set<string>()
      specialtiesSnapshot.forEach(doc => {
        if (doc.data().specialties) {
          doc.data().specialties.forEach((spec: string) => specialties.add(spec))
        }
      })
      setEspecialidades(Array.from(specialties))

      // Fetch diseases
      const diseasesQuery = query(
        collection(db, "doctors"),
        where("city", "==", selectedCity)
      )
      const diseasesSnapshot = await getDocs(diseasesQuery)
      
      const diseases = new Set<string>()
      diseasesSnapshot.forEach(doc => {
        if (doc.data().treatableDiseases) {
          doc.data().treatableDiseases.forEach((disease: string) => diseases.add(disease))
        }
      })
      setPadecimientos(Array.from(diseases))
    }

    fetchData()
  }, [selectedCity])

  const getPaginatedOptions = (type: string) => {
    const allOptions = type === "especialidad" ? especialidades : padecimientos
    const loadCount = loadMoreState[type as keyof typeof loadMoreState]
    
    if (loadCount === 1) return allOptions.slice(0, 50)
    if (loadCount === 2) return allOptions.slice(0, 100)
    if (loadCount === 3) return allOptions.slice(0, 150)
    if (loadCount === 4) return allOptions.slice(0, 200)
    if (loadCount === 5) return allOptions.slice(0, 400)
    return allOptions
  }

  const handleLoadMore = (type: string) => {
    setLoadMoreState(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev] + 1
    }))
    setSearchValue("") // Clear selection when loading more
  }

  const getOptionsForType = () => {
    if (!searchBy) return []
    
    switch (searchBy) {
      case "especialidad": return getPaginatedOptions("especialidad")
      case "padecimiento": return getPaginatedOptions("padecimiento")
      default: return []
    }
  }

  const shouldShowLoadMore = (type: string) => {
    const allOptions = type === "especialidad" ? especialidades : padecimientos
    const loadCount = loadMoreState[type as keyof typeof loadMoreState]
    return allOptions.length > 50 * loadCount
  }

  const handleSearch = async () => {
    if (!selectedCity || !searchValue) return

    setIsSearching(true)
    try {
      await trackSearch(searchBy || "ciudad", searchValue)
      
      // Construct the query parameters based on the search
      const params = new URLSearchParams()
      params.append("ciudad", selectedCity)
      
      if (searchBy === "especialidad") {
        params.append("especialidad", searchValue)
      } else if (searchBy === "padecimiento") {
        params.append("padecimiento", searchValue)
      }
      
      router.push(`/buscar?${params.toString()}`)
    } catch (error) {
      console.error("Error tracking search:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className={`bg-card rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 items-end">
        {/* First Dropdown - City (Required) */}
        <div className="w-full md:w-1/3">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Buscar en
          </label>
          <Select 
            value={selectedCity} 
            onValueChange={(value) => {
              setSelectedCity(value)
              setSearchBy("")
              setSearchValue("")
            }}
          >
            <SelectTrigger id="city" className="w-full">
              <SelectValue placeholder="Selecciona una ciudad" />
            </SelectTrigger>
            <SelectContent>
              {ciudades.map((ciudad) => (
                <SelectItem key={ciudad} value={ciudad}>
                  {ciudad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Second Dropdown - Search By (Required if city is selected) */}
        {selectedCity && (
          <div className="w-full md:w-1/3">
            <label htmlFor="search-by" className="block text-sm font-medium mb-1">
              Buscar por
            </label>
            <Select 
              value={searchBy} 
              onValueChange={(value) => {
                setSearchBy(value)
                setSearchValue("")
              }}
            >
              <SelectTrigger id="search-by" className="w-full">
                <SelectValue placeholder="Selecciona criterio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especialidad">Especialidad</SelectItem>
                <SelectItem value="padecimiento">Enfermedad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Third Dropdown - Specialty or Disease (if searchBy is selected) */}
        {searchBy && (
          <div className="w-full md:w-1/3">
            <label htmlFor="search-value" className="block text-sm font-medium mb-1">
              {searchBy === "especialidad" ? "Especialidad" : "Enfermedad"}
            </label>
            <Select value={searchValue} onValueChange={setSearchValue}>
              <SelectTrigger id="search-value" className="w-full">
                <SelectValue placeholder={`Selecciona ${searchBy === "especialidad" ? "especialidad" : "enfermedad"}`} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {getOptionsForType().map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
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
                    {loadMoreState[searchBy as keyof typeof loadMoreState] < 5 ? "Ver más" : "Ver más allá"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

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