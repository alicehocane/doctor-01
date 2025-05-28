import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DoctorProfile from "@/components/doctor-profile"
import MainLayout from "@/components/main-layout"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface DoctorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  try {
    const docRef = doc(db, "doctors", params.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const doctorData = docSnap.data()
      const doctorName = doctorData.fullName || "Dr. Sin Nombre"
      const specialties = doctorData.specialties?.join(", ") || "Médico"

      return {
        title: `${doctorName} - ${specialties} | Busca Doctor México`,
        description: `Información de contacto y perfil profesional de ${doctorName}, ${specialties} en México.`,
        openGraph: {
          title: `${doctorName} - ${specialties}`,
          description: `Perfil profesional de ${doctorName}, ${specialties}. Información de contacto, especialidades y padecimientos tratados.`,
          url: `https://www.buscadoctormexico.mx/doctor/${params.id}`,
          type: 'profile',
        },
        twitter: {
          card: 'summary',
          title: `${doctorName} - ${specialties}`,
          description: `Perfil profesional de ${doctorName}, ${specialties} en Busca Doctor México`,
        },
      }
    }
  } catch (error) {
    console.error("Error fetching doctor metadata:", error)
  }

  // Fallback metadata if doctor not found or error occurs
  return {
    title: "Perfil de Médico | Busca Doctor México",
    description: "Información profesional y de contacto del médico",
  }
}

export default function DoctorPage({ params }: DoctorPageProps) {
  const { id } = params

  return (
    <MainLayout showSearch={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/buscar">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver a resultados
        </Link>
      </Button>

      <DoctorProfile id={id} />
    </MainLayout>
  )
}