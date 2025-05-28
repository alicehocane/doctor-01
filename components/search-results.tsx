"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import DoctorCard from "@/components/doctor-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter,
  orderBy,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import SearchResultsSkeleton from "@/components/search-results-skeleton"

interface SearchResultsProps {
  tipo: string
  valor: string
}

// Cache object outside the component
let doctorsCache: {
  [key: string]: {
    doctors: DocumentData[]
    totalDoctors: number
    timestamp: number
  }
} = {}
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds


export default function SearchResults({ tipo, valor }: SearchResultsProps) {
  const router = useRouter()
  const [doctors, setDoctors] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null)
  const itemsPerPage = 15

  // Create a unique cache key based on search parameters and page
  const getCacheKey = useCallback(() => {
    return `${tipo}-${valor}-${currentPage}`
  }, [tipo, valor, currentPage])

  // Enhanced priority scoring function
  const calculatePriorityScore = useCallback((doctor: DocumentData) => {
    let score = 0;
    
    // Highest priority: has diseases treated (regardless of match)
    if (doctor.diseasesTreated?.length > 0) {
      score += 100; // Base score for having any diseases treated
      
      // Additional points for matching diseases
      if (doctor.diseasesTreated.some((d: string) => 
        d.toLowerCase().includes(valor.toLowerCase()))) {
        score += 50; // Extra points for matching diseases
      }
    }
    
    // Specialty matches
    if (doctor.specialties?.some((s: string) => 
      s.toLowerCase().includes(valor.toLowerCase()))) {
      score += 30;
    }
    
    // City matches
    if (doctor.cities?.some((c: string) => 
      c.toLowerCase().includes(valor.toLowerCase()))) {
      score += 20;
    }
    
    // Phone number matches
    if (doctor.phoneNumbers?.some((p: string) => p.includes(valor))) {
      score += 10;
    }
    
    return score;
  }, [valor]);

  const fetchDoctors = useCallback(async () => {
    const cacheKey = getCacheKey()
    const cachedData = doctorsCache[cacheKey]

    // Return cached data if it exists and is fresh
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      setDoctors(cachedData.doctors)
      setTotalDoctors(cachedData.totalDoctors)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const doctorsRef = collection(db, "doctors")
      let q

      // Create base query based on search type
      if (tipo === "ciudad") {
        q = query(doctorsRef, where("cities", "array-contains", valor))
      } else if (tipo === "especialidad") {
        q = query(doctorsRef, where("specialties", "array-contains", valor))
      } else if (tipo === "padecimiento") {
        q = query(doctorsRef, where("diseasesTreated", "array-contains", valor))
      } else {
        // General search across multiple fields
        q = query(doctorsRef)
      }

      const querySnapshot = await getDocs(q)
      setTotalDoctors(querySnapshot.size)

      // Process and sort doctors
      const allDoctors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        priorityScore: calculatePriorityScore(doc.data())
      }))

      // Sort by priority score (descending), then by name
      const sortedDoctors = allDoctors.sort((a, b) => {
        // First by priority score (higher first)
        if (b.priorityScore !== a.priorityScore) {
          return b.priorityScore - a.priorityScore
        }
        // Then by name (alphabetical)
        return a.fullName?.localeCompare(b.fullName || '')
      })

      // Apply pagination
      const startIdx = (currentPage - 1) * itemsPerPage
      const paginatedDoctors = sortedDoctors.slice(startIdx, startIdx + itemsPerPage)

      // Update cache
      doctorsCache[cacheKey] = {
        doctors: paginatedDoctors,
        totalDoctors: querySnapshot.size,
        timestamp: Date.now()
      }

      setDoctors(paginatedDoctors)
      
      // Update last visible for pagination
      if (querySnapshot.docs.length > startIdx + itemsPerPage) {
        setLastVisible(querySnapshot.docs[startIdx + itemsPerPage - 1])
      } else {
        setLastVisible(null)
      }

    } catch (error) {
      console.error("Error fetching doctors:", error)
      // Fallback to mock data
      const mockDoctors = getMockDoctors(tipo, valor)
      setDoctors(mockDoctors)
      setTotalDoctors(mockDoctors.length)
    } finally {
      setLoading(false)
    }
  }, [tipo, valor, currentPage, calculatePriorityScore, getCacheKey])


    useEffect(() => {
  setCurrentPage(1)
}, [tipo, valor])

useEffect(() => {
  fetchDoctors()
}, [fetchDoctors])


  // Helper function for mock data
  const getMockDoctors = (searchType: string, searchValue: string) => {
    const allMockDoctors = [
      {
        id: "WDONFz7u8gQm5Sslxd43",
        fullName: "Dr. Luis Felipe Aguilar Aguilar",
        licenseNumber: "12278122 9821017",
        specialties: ["Cardiólogo", "Angiólogo"],
        focusedon: ["Hemodinamia", "Cardiólogo Intervencionista", "Cardiología clínica"],
        diseasesTreated: ["Arritmias", "Hipertensión", "Insuficiencia cardíaca"],
        cities: ["Monterrey", "Guadalajara"],
        addresses: ["Centro Médico Hidalgo - Consultorio 205, Miguel Hidalgo y Costilla 2425, Monterrey"],
        phoneNumbers: ["8117331493", "8140589516"],
      },
      {
        id: "XYZ123456789",
        fullName: "Dra. María González Rodríguez",
        specialties: ["Pediatra", "Neonatólogo"],
        focusedon: ["Pediatría general", "Desarrollo infantil"],
        diseasesTreated: ["Asma infantil", "Alergias", "Infecciones respiratorias"],
        cities: ["Ciudad de México", "Puebla"],
        addresses: ["Hospital Ángeles - Consultorio 302, Av. Reforma 1234, Ciudad de México"],
        phoneNumbers: ["5512345678", "5598765432"],
      },
      {
        id: "NO_DISEASES_123",
        fullName: "Dr. Juan Pérez",
        specialties: ["Dermatólogo"],
        focusedon: ["Dermatología cosmética"],
        diseasesTreated: [], // No diseases treated
        cities: ["Monterrey"],
        addresses: ["Consultorio particular - Av. San Pedro 123"],
        phoneNumbers: ["8187654321"],
      }
    ]

    // Filter mock data based on search type and value
    return allMockDoctors.filter(doctor => {
      if (!searchType) return true
      
      const searchValLower = searchValue.toLowerCase()
      
      if (searchType === "ciudad") {
        return doctor.cities?.some(c => c.toLowerCase().includes(searchValLower))
      } else if (searchType === "especialidad") {
        return doctor.specialties?.some(s => s.toLowerCase().includes(searchValLower))
      } else if (searchType === "padecimiento") {
        return doctor.diseasesTreated?.some(d => d.toLowerCase().includes(searchValLower))
      }
      return true
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return <SearchResultsSkeleton />
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron médicos que coincidan con tu búsqueda.</p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalDoctors / itemsPerPage)

  return (
    <div>
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} searchType={tipo} searchValue={valor} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}