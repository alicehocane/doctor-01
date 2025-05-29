// components/search-results.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import DoctorCard from "@/components/doctor-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  collection,
  query,
  where,
  getDocs,
  type DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import SearchResultsSkeleton from "@/components/search-results-skeleton"

interface SearchResultsProps {
  tipo: "ciudad" | "especialidad" | "padecimiento"
  valor: string
  ciudad?: string
}

let doctorsCache: Record<
  string,
  { doctors: DocumentData[]; totalDoctors: number; timestamp: number }
> = {}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 1 week
const ITEMS_PER_PAGE = 15

export default function SearchResults({
  tipo,
  valor,
  ciudad,
}: SearchResultsProps) {
  const [doctors, setDoctors] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDoctors, setTotalDoctors] = useState(0)

  const getCacheKey = useCallback(
    () => `${tipo}-${valor}-${ciudad ?? ""}-${currentPage}`,
    [tipo, valor, ciudad, currentPage]
  )

  const calculatePriorityScore = useCallback(
    (doc: DocumentData) => {
      let score = 0
      if (Array.isArray(doc.diseasesTreated) && doc.diseasesTreated.length > 0) {
        score += 100
        if (
          doc.diseasesTreated.some((d: string) =>
            d.toLowerCase().includes(valor.toLowerCase())
          )
        ) {
          score += 50
        }
      }
      if (
        Array.isArray(doc.specialties) &&
        doc.specialties.some((s: string) =>
          s.toLowerCase().includes(valor.toLowerCase())
        )
      ) {
        score += 30
      }
      if (
        Array.isArray(doc.cities) &&
        doc.cities.some((c: string) =>
          c.toLowerCase().includes(valor.toLowerCase())
        )
      ) {
        score += 20
      }
      if (
        Array.isArray(doc.phoneNumbers) &&
        doc.phoneNumbers.some((p: string) => p.includes(valor))
      ) {
        score += 10
      }
      return score
    },
    [valor]
  )

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

      // 1) Firestore query with only one array-contains
      let baseQuery
      if (tipo === "ciudad") {
        baseQuery = query(doctorsRef, where("cities", "array-contains", valor))
      } else if (tipo === "especialidad") {
        baseQuery = query(
          doctorsRef,
          where("specialties", "array-contains", valor)
        )
      } else {
        baseQuery = query(
          doctorsRef,
          where("diseasesTreated", "array-contains", valor)
        )
      }

      const snap = await getDocs(baseQuery)

      // 2) Map docs & compute score
      let docsWithScore = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          priorityScore: calculatePriorityScore(data),
        }
      })

      // 3) Filter by ciudad client-side if needed
      if (ciudad && tipo !== "ciudad") {
        docsWithScore = docsWithScore.filter((doc) =>
          Array.isArray(doc.cities) && doc.cities.includes(ciudad)
        )
      }

      // 4) Sort by score, then fullName
      docsWithScore.sort((a, b) =>
        b.priorityScore - a.priorityScore ||
        (a.fullName || "").localeCompare(b.fullName || "")
      )

      // 5) Paginate
      const total = docsWithScore.length
      setTotalDoctors(total)
      const start = (currentPage - 1) * ITEMS_PER_PAGE
      const pageDocs = docsWithScore.slice(start, start + ITEMS_PER_PAGE)

      // 6) Cache & set state
      doctorsCache[cacheKey] = {
        doctors: pageDocs,
        totalDoctors: total,
        timestamp: Date.now(),
      }
      setDoctors(pageDocs)
    } catch (err) {
      console.error("Error fetching doctors:", err)
      setDoctors([])
      setTotalDoctors(0)
    } finally {
      setLoading(false)
    }
  }, [tipo, valor, ciudad, currentPage, calculatePriorityScore, getCacheKey])

  useEffect(() => {
  setCurrentPage(1)
}, [tipo, valor])

useEffect(() => {
  fetchDoctors()
}, [fetchDoctors])

  if (loading) {
    return <SearchResultsSkeleton />
  }

  if (!doctors.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No se encontraron médicos que coincidan con tu búsqueda.
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalDoctors / ITEMS_PER_PAGE)

  return (
    <div>
      <div className="space-y-4">
        {doctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            searchType={tipo}
            searchValue={valor}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => p - 1)}
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
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
