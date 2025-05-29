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
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import SearchResultsSkeleton from "@/components/search-results-skeleton"

interface SearchResultsProps {
  tipo: string
  valor: string
  ciudad?: string
}

// Cache object outside the component
let doctorsCache: {
  [key: string]: {
    doctors: DocumentData[]
    totalDoctors: number
    timestamp: number
  }
} = {}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 1 week

export default function SearchResults({ tipo, valor, ciudad }: SearchResultsProps) {
  const router = useRouter()
  const [doctors, setDoctors] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null)
  const itemsPerPage = 15

  const getCacheKey = useCallback(() => {
    return `${tipo}-${valor}-${ciudad ?? ""}-${currentPage}`
  }, [tipo, valor, ciudad, currentPage])

  const calculatePriorityScore = useCallback((doctor: DocumentData) => {
    let score = 0
    if (doctor.diseasesTreated?.length > 0) {
      score += 100
      if (doctor.diseasesTreated.some((d: string) =>
        d.toLowerCase().includes(valor.toLowerCase())
      )) {
        score += 50
      }
    }
    if (doctor.specialties?.some((s: string) =>
      s.toLowerCase().includes(valor.toLowerCase())
    )) {
      score += 30
    }
    if (doctor.cities?.some((c: string) =>
      c.toLowerCase().includes(valor.toLowerCase())
    )) {
      score += 20
    }
    if (doctor.phoneNumbers?.some((p: string) => p.includes(valor))) {
      score += 10
    }
    return score
  }, [valor])

  const fetchDoctors = useCallback(async () => {
    const cacheKey = getCacheKey()
    const cached = doctorsCache[cacheKey]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setDoctors(cached.doctors)
      setTotalDoctors(cached.totalDoctors)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const doctorsRef = collection(db, "doctors")
      let q

      if (tipo === "ciudad") {
        q = query(doctorsRef, where("cities", "array-contains", valor))
      } else if (tipo === "especialidad") {
        q = ciudad
          ? query(
              doctorsRef,
              where("specialties", "array-contains", valor),
              where("cities", "array-contains", ciudad)
            )
          : query(doctorsRef, where("specialties", "array-contains", valor))
      } else if (tipo === "padecimiento") {
        q = ciudad
          ? query(
              doctorsRef,
              where("diseasesTreated", "array-contains", valor),
              where("cities", "array-contains", ciudad)
            )
          : query(doctorsRef, where("diseasesTreated", "array-contains", valor))
      } else {
        q = ciudad
          ? query(doctorsRef, where("cities", "array-contains", ciudad))
          : query(doctorsRef)
      }

      const snapshot = await getDocs(q)
      setTotalDoctors(snapshot.size)

      const allDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        priorityScore: calculatePriorityScore(doc.data())
      }))

      const sorted = allDocs.sort((a, b) => {
        if (b.priorityScore !== a.priorityScore) {
          return b.priorityScore - a.priorityScore
        }
        return a.fullName?.localeCompare(b.fullName || "") || 0
      })

      const startIdx = (currentPage - 1) * itemsPerPage
      const pageDocs = sorted.slice(startIdx, startIdx + itemsPerPage)

      doctorsCache[cacheKey] = {
        doctors: pageDocs,
        totalDoctors: snapshot.size,
        timestamp: Date.now()
      }

      setDoctors(pageDocs)
      setLastVisible(
        snapshot.docs.length > startIdx + itemsPerPage
          ? snapshot.docs[startIdx + itemsPerPage - 1]
          : null
      )
    } catch (error) {
      console.error("Error fetching doctors:", error)
      setTotalDoctors(0)
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }, [tipo, valor, ciudad, currentPage, calculatePriorityScore, getCacheKey])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const handlePageChange = (page: number) => setCurrentPage(page)

  if (loading) return <SearchResultsSkeleton />

  if (!doctors.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No se encontraron médicos que coincidan con tu búsqueda.
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalDoctors / itemsPerPage)

  return (
    <div>
      <div className="space-y-4">
        {doctors.map(doc => (
          <DoctorCard key={doc.id} doctor={doc} searchType={tipo} searchValue={valor} />
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