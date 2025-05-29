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
  const [searchBy, setSearchBy] = useState<"especialidad" | "enfermedad">("especialidad")
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  
  // Data from Firestore
  const [cities, setCities] = useState<string[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [diseases, setDiseases] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [loadingOptions, setLoadingOptions] = useState(false)

  // Load available cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const doctorsRef = collection(db, "doctors")
        const snapshot = await getDocs(doctorsRef)
        
        const citiesSet = new Set<string>()
        snapshot.forEach(doc => {
          const doctorData = doc.data()
          if (doctorData.cities) {
            doctorData.cities.forEach((city: string) => citiesSet.add(city))
          }
        })
        
        setCities(Array.from(citiesSet))
      } catch (error) {
        console.error("Error fetching cities:", error)
      } finally {
        setLoadingCities(false)
      }
    }
    
    fetchCities()
  }, [])

  // Load specialties or diseases based on selected city
  useEffect(() => {
    if (!selectedCity) {
      setSpecialties([])
      setDiseases([])
      return
    }

    const fetchOptions = async () => {
      setLoadingOptions(true)
      try {
        const doctorsRef = collection(db, "doctors")
        const q = query(doctorsRef, where("cities", "array-contains", selectedCity))
        const snapshot = await getDocs(q)
        
        const specialtiesSet = new Set<string>()
        const diseasesSet = new Set<string>()
        
        snapshot.forEach(doc => {
          const doctorData = doc.data()
          
          // Add specialties
          if (doctorData.specialties) {
            doctorData.specialties.forEach((spec: string) => specialtiesSet.add(spec))
          }
          if (doctorData.focusedon) {
            doctorData.focusedon.forEach((spec: string) => specialtiesSet.add(spec))
          }
          
          // Add diseases
          if (doctorData.diseasesTreated) {
            doctorData.diseasesTreated.forEach((disease: string) => diseasesSet.add(disease))
          }
        })
        
        setSpecialties(Array.from(specialtiesSet))
        setDiseases(Array.from(diseasesSet))
      } catch (error) {
        console.error("Error fetching options:", error)
      } finally {
        setLoadingOptions(false)
      }
    }
    
    fetchOptions()
  }, [selectedCity])

  const handleSearch = async () => {
    if ((!selectedCity) || (!selectedOption)) return
    
    setIsSearching(true)
    try {
      // Track the search
      await trackSearch(
        searchBy === "especialidad" ? "specialty" : "disease",
        selectedOption,
        selectedCity
      )
      
      // Navigate to results page
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
            disabled={loadingCities}
          >
            <SelectTrigger id="city" className="w-full">
              <SelectValue placeholder={loadingCities ? "Cargando ciudades..." : "Selecciona una ciudad"} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
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
            disabled={!selectedCity || loadingOptions}
          >
            <SelectTrigger id="search-option" className="w-full">
              <SelectValue 
                placeholder={
                  loadingOptions ? "Cargando opciones..." : 
                  `Selecciona ${searchBy === "especialidad" ? "una especialidad" : "una enfermedad"}`
                } 
              />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {(searchBy === "especialidad" ? specialties : diseases).map((option) => (
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