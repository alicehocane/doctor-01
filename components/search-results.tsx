"use client"

import { useState, useEffect } from "react"
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
  const itemsPerPage = 30

  // Helper function to calculate priority score
  const calculatePriorityScore = (doctor: DocumentData) => {
  let score = 0;
  
  // Highest priority: exact match in specialties
  if (doctor.specialties?.some((s: string) => 
    s.toLowerCase().includes(valor.toLowerCase()))) {
    score += 100; // Highest weight
  }
  
  // Medium priority: phone number match
  if (doctor.phoneNumbers?.some((p: string) => p.includes(valor))) {
    score += 50;
  }
  
  // Lower priority: diseases treated match
  if (doctor.diseasesTreated?.some((d: string) => 
    d.toLowerCase().includes(valor.toLowerCase()))) {
    score += 10;
  }
  
  return score;
};
  


useEffect(() => {
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const doctorsRef = collection(db, "doctors");
      let q;

      // Create base query (without limit for initial fetch)
      if (tipo === "ciudad") {
        q = query(doctorsRef, where("cities", "array-contains", valor), orderBy("fullName"));
      } else if (tipo === "especialidad") {
        q = query(doctorsRef, where("specialties", "array-contains", valor), orderBy("fullName"));
      } else if (tipo === "padecimiento") {
        q = query(doctorsRef, where("diseasesTreated", "array-contains", valor), orderBy("fullName"));
      } else {
        q = query(doctorsRef, orderBy("fullName"));
      }

      // Get all matching doctors
      const querySnapshot = await getDocs(q);
      setTotalDoctors(querySnapshot.size);

      // Calculate priority scores and sort
      const allDoctors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        priorityScore: calculatePriorityScore(doc.data())
      }));

      const sortedDoctors = allDoctors.sort((a, b) => {
        // First by priority score (descending)
        if (b.priorityScore !== a.priorityScore) {
          return b.priorityScore - a.priorityScore;
        }
        // Then alphabetically
        return a.fullName.localeCompare(b.fullName);
      });

      // Apply pagination
      const startIdx = (currentPage - 1) * itemsPerPage;
      const paginatedDoctors = sortedDoctors.slice(startIdx, startIdx + itemsPerPage);

      setDoctors(paginatedDoctors);
      
      // Set last visible for pagination
      if (querySnapshot.docs.length > startIdx + itemsPerPage) {
        setLastVisible(querySnapshot.docs[startIdx + itemsPerPage - 1]);
      } else {
        setLastVisible(null);
      }

    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, [tipo, valor, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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

  // Calculate total pages
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
