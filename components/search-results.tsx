"use client"

import { useState, useEffect, useRef } from "react"
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

export default function SearchResults({ tipo, valor }: SearchResultsProps) {
  const router = useRouter()
  const [doctors, setDoctors] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null)
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null)
  const itemsPerPage = 5
  const pagesStack = useRef<QueryDocumentSnapshot[]>([])

  const buildQuery = (startAfterDoc: QueryDocumentSnapshot | null = null) => {
    const doctorsRef = collection(db, "doctors")
    let q

    if (tipo === "ciudad") {
      q = startAfterDoc
        ? query(
            doctorsRef,
            where("cities", "array-contains", valor),
            orderBy("fullName"),
            startAfter(startAfterDoc),
            limit(itemsPerPage)
        : query(
            doctorsRef,
            where("cities", "array-contains", valor),
            orderBy("fullName"),
            limit(itemsPerPage)
    } else if (tipo === "especialidad") {
      q = startAfterDoc
        ? query(
            doctorsRef,
            where("specialties", "array-contains", valor),
            orderBy("fullName"),
            startAfter(startAfterDoc),
            limit(itemsPerPage)
        : query(
            doctorsRef,
            where("specialties", "array-contains", valor),
            orderBy("fullName"),
            limit(itemsPerPage)
    } else if (tipo === "padecimiento") {
      q = startAfterDoc
        ? query(
            doctorsRef,
            where("diseasesTreated", "array-contains", valor),
            orderBy("fullName"),
            startAfter(startAfterDoc),
            limit(itemsPerPage)
        : query(
            doctorsRef,
            where("diseasesTreated", "array-contains", valor),
            orderBy("fullName"),
            limit(itemsPerPage)
    } else {
      q = startAfterDoc
        ? query(doctorsRef, orderBy("fullName"), startAfter(startAfterDoc), limit(itemsPerPage))
        : query(doctorsRef, orderBy("fullName"), limit(itemsPerPage))
    }

    return q
  }

  const fetchFilteredCount = async () => {
    try {
      const q = buildQuery()
      const countQuery = q // Use the same query but without limit
      const countSnapshot = await getDocs(countQuery)
      return countSnapshot.size
    } catch (error) {
      console.error("Error fetching count:", error)
      return 0
    }
  }

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true)
      try {
        // Reset pagination state
        pagesStack.current = []
        setFirstVisible(null)
        setLastVisible(null)
        setCurrentPage(1)

        // Get filtered count
        const count = await fetchFilteredCount()
        setTotalDoctors(count)

        // Get first page
        const q = buildQuery()
        const querySnapshot = await getDocs(q)
        
        if (querySnapshot.docs.length > 0) {
          setFirstVisible(querySnapshot.docs[0])
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
          pagesStack.current = [querySnapshot.docs[0]]
        }

        const fetchedDoctors = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setDoctors(fetchedDoctors)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [tipo, valor])

  const fetchNextPage = async () => {
    if (!lastVisible) return

    setLoading(true)
    try {
      const q = buildQuery(lastVisible)
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.docs.length > 0) {
        const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        setLastVisible(newLastVisible)
        pagesStack.current.push(lastVisible) // Save the previous lastVisiblee
      }

      const fetchedDoctors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setDoctors(fetchedDoctors)
      setCurrentPage(prev => prev + 1)
    } catch (error) {
      console.error("Error fetching next page:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPreviousPage = async () => {
    if (pagesStack.current.length < 2) return // Need at least one previous page

    setLoading(true)
    try {
      // Remove current page from stack
      pagesStack.current.pop()
      
      // Get the previous page's startAfter document
      const prevStartAfter = pagesStack.current[pagesStack.current.length - 2] || null
      
      const q = buildQuery(prevStartAfter)
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.docs.length > 0) {
        setFirstVisible(querySnapshot.docs[0])
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
      }

      const fetchedDoctors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setDoctors(fetchedDoctors)
      setCurrentPage(prev => prev - 1)
    } catch (error) {
      console.error("Error fetching previous page:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page > currentPage) {
      fetchNextPage()
    } else if (page < currentPage) {
      fetchPreviousPage()
    }
  }

  // For demo purposes, we'll use mock data if Firestore is not connected
  useEffect(() => {
    if (doctors.length === 0 && !loading) {
      // Use mock data as fallback
      const mockDoctors = [
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
      ]
      setDoctors(mockDoctors)
      setTotalDoctors(mockDoctors.length)
    }
  }, [doctors, loading])

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

  // Calculate total pages based on filtered results
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
            disabled={currentPage === totalPages || doctors.length < itemsPerPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}