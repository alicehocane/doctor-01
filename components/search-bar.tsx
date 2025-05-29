"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { trackSearch } from "@/lib/search-tracker"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"


export default function SearchBar() {
  const router = useRouter()
  const [cities, setCities] = useState<string[]>([]); // Replace `ciudades`
  const [selectedCity, setSelectedCity] = useState("")
  const [searchBy, setSearchBy] = useState<"especialidad" | "padecimiento">("especialidad")
  const [searchValue, setSearchValue] = useState("")
  const [options, setOptions] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Step 1: Load all cities dynamically
  useEffect(() => {
  const fetchCities = async () => {
    try {
      const snapshot = await getDocs(collection(db, "doctors"));
      console.log("Fetched doctor docs:", snapshot.docs.map((d) => d.data()))

      const uniqueCities = new Set<string>();

      snapshot.forEach(doc => {
        const data = doc.data();
        if (Array.isArray(data.cities)) {
          data.cities.forEach(city => uniqueCities.add(city));
        }
      });

      setCities(Array.from(uniqueCities).sort());
    } catch (error) {
      console.error("Failed to fetch cities from Firestore:", error);
    }
  };

  fetchCities();
}, []);

  // Step 2: Load specialties or diseases based on city
  useEffect(() => {
    const fetchOptions = async () => {
      if (!selectedCity) return

      const q = query(collection(db, "doctors"), where("cities", "array-contains", selectedCity))
      const doctorSnap = await getDocs(q)

      const items = new Set<string>()
      doctorSnap.forEach(doc => {
        const data = doc.data()
        if (searchBy === "especialidad" && Array.isArray(data.specialties)) {
          data.specialties.forEach((sp: string) => items.add(sp))
        }
        if (searchBy === "padecimiento" && Array.isArray(data.diseasesTreated)) {
          data.diseasesTreated.forEach((ds: string) => items.add(ds))
        }
      })
      setOptions(Array.from(items).sort())
    }

    fetchOptions()
  }, [selectedCity, searchBy])

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
    <div className="bg-card rounded-lg shadow-sm p-4">
      <div className={`flex gap-3 items-end ${selectedCity ? "flex-col md:flex-row" : "justify-center"}`}>
        
        {/* First Dropdown - City */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium mb-1">Buscar en (Search in)</label>
          <Select value={selectedCity} onValueChange={(value) => {
            setSelectedCity(value)
            setSearchValue("")
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una ciudad" />
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

        {/* Second Dropdown - Search By */}
        {selectedCity && (
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-1">Buscar por (Search by)</label>
            <Select value={searchBy} onValueChange={(value) => {
              setSearchBy(value as "especialidad" | "padecimiento")
              setSearchValue("")
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona tipo de búsqueda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especialidad">Especialidad</SelectItem>
                <SelectItem value="padecimiento">Padecimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Third Dropdown - Specialty or Disease */}
        {selectedCity && options.length > 0 && (
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-1">
              {searchBy === "especialidad" ? "Especialidad" : "Padecimiento"}
            </label>
            <Select value={searchValue} onValueChange={setSearchValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Selecciona ${searchBy}`} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {options.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
