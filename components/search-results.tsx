"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import DoctorCard from "@/components/doctor-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import SearchResultsSkeleton from "@/components/search-results-skeleton"

export default function SearchResults() {
  const searchParams = useSearchParams()
  const ciudad = searchParams.get('ciudad')
  const tipo = searchParams.get('tipo')
  const valor = searchParams.get('valor')
  
  
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [cityDoctorCache, setCityDoctorCache] = useState<Record<string, string[]>>({})
  const itemsPerPage = 10

  // Calculate match score for sorting
  const calculateMatchScore = useCallback((doctor: any) => {
    let score = 0
    
    // Exact matches get highest priority
    if (tipo === "especialidad") {
      if (doctor.specialties?.includes(valor)) score += 100
      else if (doctor.specialties?.some((s: string) => s.includes(valor || ''))) score += 50
    } else {
      if (doctor.diseasesTreated?.includes(valor)) score += 100
      else if (doctor.diseasesTreated?.some((d: string) => d.includes(valor || ''))) score += 50
    }
    
    // Bonus for focusedon matches
    if (doctor.focusedon?.some((f: string) => f.includes(valor || ''))) {
      score += 30
    }
    
    return score
  }, [tipo, valor])

  // Main search function
  const fetchDoctors = useCallback(async () => {
    if (!tipo || !valor) {
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
      let doctorsQuery;
      
      // Case 1: City search (clicked from ciudades featured section)
      if (tipo === "ciudad") {
        doctorsQuery = query(
          collection(db, "doctors"),
          where("cities", "array-contains", valor),
          orderBy("fullName"),
          limit(1000)
        )
      } 
      // Case 2: Specialty or condition search with city specified
      else if (ciudad) {
        doctorsQuery = query(
          collection(db, "doctors"),
          where("cities", "array-contains", ciudad),
          where(tipo === "especialidad" ? "specialties" : "diseasesTreated", "array-contains", valor),
          orderBy("fullName"),
          limit(1000)
        )
      }
      // Case 3: Specialty or condition search without city (from featured section)
      else {
        doctorsQuery = query(
          collection(db, "doctors"),
          where(tipo === "especialidad" ? "specialties" : "diseasesTreated", "array-contains", valor),
          orderBy("fullName"),
          limit(1000)
        )
      }

      const snapshot = await getDocs(doctorsQuery)
      const doctors = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        matchScore: 100 // All matches are equal since we're filtering by exact matches
      }))

      setTotalDoctors(doctors.length)
      const startIdx = (currentPage - 1) * itemsPerPage
      setDoctors(doctors.slice(startIdx, startIdx + itemsPerPage))

    } catch (error) {
      console.error("Search failed:", error)
      setDoctors([])
      setTotalDoctors(0)
    } finally {
      setLoading(false)
    }
  }, [ciudad, tipo, valor, currentPage])

  // Fallback method when parallel queries fail
  const fallbackClientSideFilter = useCallback(async () => {
    try {
      // Check cache first
      if (cityDoctorCache[ciudad]) {
        const cachedIds = cityDoctorCache[ciudad]
        const docs = await Promise.all(
          cachedIds.map(id => getDocs(doc(db, "doctors", id)))
        )
        
        const filtered = docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(doctor => 
            tipo === "especialidad"
              ? doctor.specialties?.includes(valor)
              : doctor.diseasesTreated?.includes(valor)
          )
          .map(d => ({ ...d, matchScore: calculateMatchScore(d) }))
          .sort((a, b) => b.matchScore - a.matchScore)

        setTotalDoctors(filtered.length)
        const startIdx = (currentPage - 1) * itemsPerPage
        setDoctors(filtered.slice(startIdx, startIdx + itemsPerPage))
        return
      }

      // No cache - fetch fresh
      const cityQuery = query(
        collection(db, "doctors"),
        where("cities", "array-contains", ciudad),
        limit(500)
      )
      
      const snapshot = await getDocs(cityQuery)
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doctor => 
          tipo === "especialidad"
            ? doctor.specialties?.includes(valor)
            : doctor.diseasesTreated?.includes(valor)
        )
        .map(d => ({ ...d, matchScore: calculateMatchScore(d) }))
        .sort((a, b) => b.matchScore - a.matchScore)

      setTotalDoctors(filtered.length)
      const startIdx = (currentPage - 1) * itemsPerPage
      setDoctors(filtered.slice(startIdx, startIdx + itemsPerPage))

      // Update cache
      setCityDoctorCache(prev => ({
        ...prev,
        [ciudad]: snapshot.docs.map(d => d.id)
      }))

    } catch (error) {
      console.error("Fallback failed:", error)
      setDoctors([])
      setTotalDoctors(0)
    }
  }, [ciudad, tipo, valor, currentPage, cityDoctorCache, calculateMatchScore])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [ciudad, tipo, valor])

  // Trigger search when params or page changes
  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

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
          No se encontraron médicos en {ciudad} para {
            tipo === "especialidad" 
              ? `especialidad: ${valor}`
              : `padecimiento: ${valor}`
          }
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalDoctors / itemsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Resultados en {ciudad}
        </h1>
        <p className="text-muted-foreground">
          {totalDoctors} {totalDoctors === 1 ? 'médico encontrado' : 'médicos encontrados'} para {
            tipo === "especialidad" 
              ? `especialidad: ${valor}`
              : `padecimiento: ${valor}`
          }
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
        <div className="flex justify-center items-center mt-8 gap-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )

  function handlePageChange(page: number) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}