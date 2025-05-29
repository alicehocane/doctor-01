"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

// Cache object outside the component
let doctorsCache: {
  [key: string]: {
    doctors: DocumentData[]
    totalDoctors: number
    timestamp: number
  }
} = {}
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds

export default function SearchResults() {
  const searchParams = useSearchParams()
  const ciudad = searchParams.get('ciudad')
  const tipo = searchParams.get('tipo')
  const valor = searchParams.get('valor')
  
  const router = useRouter()
  const [doctors, setDoctors] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null)
  const itemsPerPage = 15

  // Create a unique cache key based on search parameters and page
  const getCacheKey = useCallback(() => {
    return `${ciudad}-${tipo}-${valor}-${currentPage}`
  }, [ciudad, tipo, valor, currentPage])

  // Enhanced priority scoring function
  const calculatePriorityScore = useCallback((doctor: DocumentData) => {
    if (!tipo || !valor) return 0;
    
    let score = 0;
    const searchValLower = valor.toLowerCase();
    
    // Highest priority: exact matches
    if (tipo === "especialidad" && doctor.specialties?.some((s: string) => 
      s.toLowerCase() === searchValLower)) {
      score += 100;
    } 
    else if (tipo === "padecimiento" && doctor.diseasesTreated?.some((d: string) => 
      d.toLowerCase() === searchValLower)) {
      score += 100;
    }
    // Partial matches
    else if (tipo === "especialidad" && doctor.specialties?.some((s: string) => 
      s.toLowerCase().includes(searchValLower))) {
      score += 50;
    }
    else if (tipo === "padecimiento" && doctor.diseasesTreated?.some((d: string) => 
      d.toLowerCase().includes(searchValLower))) {
      score += 50;
    }
    
    // City match bonus (regardless of search type)
    if (ciudad && doctor.cities?.some((c: string) => 
      c.toLowerCase() === ciudad.toLowerCase())) {
      score += 30;
    }
    
    return score;
  }, [tipo, valor, ciudad]);

  const fetchDoctors = useCallback(async () => {
    if (!ciudad || !tipo || !valor) {
      setLoading(false);
      return;
    }

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
      let q = query(doctorsRef)

      // First filter by city if specified
      if (ciudad) {
        q = query(q, where("cities", "array-contains", ciudad))
      }

      // Then filter by search type if specified
      if (tipo && valor) {
        if (tipo === "especialidad") {
          q = query(q, where("specialties", "array-contains", valor))
        } else if (tipo === "padecimiento") {
          q = query(q, where("diseasesTreated", "array-contains", valor))
        }
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
      const mockDoctors = getMockDoctors()
      setDoctors(mockDoctors)
      setTotalDoctors(mockDoctors.length)
    } finally {
      setLoading(false)
    }
  }, [ciudad, tipo, valor, currentPage, calculatePriorityScore, getCacheKey])

  useEffect(() => {
    setCurrentPage(1)
  }, [ciudad, tipo, valor])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  // Helper function for mock data
  const getMockDoctors = () => {
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

    // Filter mock data based on search parameters
    return allMockDoctors.filter(doctor => {
      // Filter by city if specified
      if (ciudad && !doctor.cities?.some(c => c.toLowerCase() === ciudad.toLowerCase())) {
        return false
      }
      
      // Filter by search type if specified
      if (tipo && valor) {
        const searchValLower = valor.toLowerCase()
        if (tipo === "especialidad") {
          return doctor.specialties?.some(s => s.toLowerCase().includes(searchValLower))
        } else if (tipo === "padecimiento") {
          return doctor.diseasesTreated?.some(d => d.toLowerCase().includes(searchValLower))
        }
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

  if (!ciudad || !tipo || !valor) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Por favor completa todos los campos de búsqueda.</p>
      </div>
    )
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No se encontraron médicos en {ciudad} que coincidan con tu búsqueda de {tipo === "especialidad" ? "especialidad" : "padecimiento"}: {valor}
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalDoctors / itemsPerPage)

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Resultados en {ciudad} para {tipo === "especialidad" ? "especialidad" : "padecimiento"}: {valor}
        </h2>
        <p className="text-sm text-muted-foreground">
          {totalDoctors} {totalDoctors === 1 ? 'médico encontrado' : 'médicos encontrados'}
        </p>
      </div>

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor} 
            highlightField={tipo === "especialidad" ? "specialties" : "diseasesTreated"}
            highlightValue={valor}
          />
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