"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { trackSearch } from "@/lib/search-tracker"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase" // Make sure you have your Firebase config setup

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [searchBy, setSearchBy] = useState<"especialidad" | "enfermedad">("especialidad")
  const [searchValue, setSearchValue] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  
  // Data from Firestore
  const [cities, setCities] = useState<string[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [diseases, setDiseases] = useState<string[]>([])
  const [loading, setLoading] = useState({
    cities: true,
    specialties: false,
    diseases: false
  })

  // Fetch available cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesSnapshot = await getDocs(collection(db, "cities"))
        const citiesData = citiesSnapshot.docs.map(doc => doc.data().name)
        setCities(citiesData)
      } catch (error) {
        console.error("Error fetching cities:", error)
      } finally {
        setLoading(prev => ({ ...prev, cities: false }))
      }
    }
    
    fetchCities()
  }, [])

  // Fetch specialties or diseases based on selected city
  useEffect(() => {
    if (!selectedCity) return

    const fetchOptions = async () => {
      try {
        if (searchBy === "especialidad") {
          setLoading(prev => ({ ...prev, specialties: true }))
          
          // Query doctors in the selected city and get their specialties
          const doctorsQuery = query(
            collection(db, "doctors"),
            where("city", "==", selectedCity)
          )
          const doctorsSnapshot = await getDocs(doctorsQuery)
          
          // Get unique specialties from these doctors
          const specialtiesSet = new Set<string>()
          doctorsSnapshot.forEach(doc => {
            const doctorData = doc.data()
            if (doctorData.specialties) {
              doctorData.specialties.forEach((spec: string) => specialtiesSet.add(spec))
            }
          })
          
          setSpecialties(Array.from(specialtiesSet))
        } else {
          setLoading(prev => ({ ...prev, diseases: true }))
          
          // Query diseases treated in the selected city
          const diseasesQuery = query(
            collection(db, "diseases"),
            where("availableCities", "array-contains", selectedCity)
          )
          const diseasesSnapshot = await getDocs(diseasesQuery)
          const diseasesData = diseasesSnapshot.docs.map(doc => doc.data().name)
          
          setDiseases(diseasesData)
        }
      } catch (error) {
        console.error(`Error fetching ${searchBy}:`, error)
      } finally {
        setLoading(prev => ({
          ...prev,
          specialties: false,
          diseases: false
        }))
      }
    }

    fetchOptions()
  }, [selectedCity, searchBy])

  const handleSearch = async () => {
    if (!selectedCity || !searchValue) return
    
    setIsSearching(true)
    try {
      await trackSearch(searchBy, searchValue)
      
      // Construct the search URL based on the search type
      let searchParam = ""
      if (searchBy === "especialidad") {
        searchParam = `especialidad=${encodeURIComponent(searchValue)}&ciudad=${encodeURIComponent(selectedCity)}`
      } else {
        searchParam = `enfermedad=${encodeURIComponent(searchValue)}&ciudad=${encodeURIComponent(selectedCity)}`
      }
      
      router.push(`/buscar?${searchParam}`)
    } catch (error) {
      console.error("Error tracking search:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className={`bg-card rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 items-end">
        {/* First Dropdown - City Selection (Required) */}
        <div className="w-full md:w-1/3">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Buscar en
          </label>
          <Select 
            value={selectedCity} 
            onValueChange={(value) => {
              setSelectedCity(value)
              setSearchValue("") // Reset search value when city changes
            }}
            disabled={loading.cities}
          >
            <SelectTrigger id="city" className="w-full">
              <SelectValue placeholder={loading.cities ? "Cargando ciudades..." : "Selecciona una ciudad"} />
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

        {/* Second Dropdown - Search By (Required, only shown when city is selected) */}
        {selectedCity && (
          <div className="w-full md:w-1/3">
            <label htmlFor="search-by" className="block text-sm font-medium mb-1">
              Buscar por
            </label>
            <Select 
              value={searchBy} 
              onValueChange={(value: "especialidad" | "enfermedad") => {
                setSearchBy(value)
                setSearchValue("") // Reset search value when search type changes
              }}
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
        )}

        {/* Third Dropdown - Dynamic Options (only shown when city and search type are selected) */}
        {selectedCity && searchBy && (
          <div className="w-full md:w-1/3">
            <label htmlFor="search-value" className="block text-sm font-medium mb-1">
              {searchBy === "especialidad" ? "Especialidad" : "Enfermedad"}
            </label>
            <Select 
              value={searchValue} 
              onValueChange={setSearchValue}
              disabled={
                (searchBy === "especialidad" && loading.specialties) || 
                (searchBy === "enfermedad" && loading.diseases)
              }
            >
              <SelectTrigger id="search-value" className="w-full">
                <SelectValue 
                  placeholder={
                    (searchBy === "especialidad" && loading.specialties) ? "Cargando especialidades..." :
                    (searchBy === "enfermedad" && loading.diseases) ? "Cargando enfermedades..." :
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