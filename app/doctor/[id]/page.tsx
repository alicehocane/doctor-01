import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DoctorProfile from "@/components/doctor-profile"
import MainLayout from "@/components/main-layout"
import { getFirestore } from "firebase-admin/firestore"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-admin"

interface DoctorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  try {
    const docRef = doc(db, "doctors", params.id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return {
        title: "Doctor no encontrado | Busca Doctor México",
        description: "El perfil del doctor no está disponible.",
      }
    }

    const doctorData = docSnap.data()
    const doctorName = doctorData.name || "Doctor"
    const specialty = doctorData.specialty || "Especialista"

    return {
      title: `${doctorName} - ${specialty} | Busca Doctor México`,
      description: `Información de contacto y perfil profesional de ${doctorName}, ${specialty} en México.`,
      openGraph: {
        images: doctorData.photoURL ? [doctorData.photoURL] : [],
      },
    }
  } catch (error) {
    console.error("Error fetching doctor metadata:", error)
    return {
      title: "Doctor | Busca Doctor México",
      description: "Perfil profesional del doctor en México.",
    }
  }
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const { id } = params

  try {
    const docRef = doc(db, "doctors", id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return (
        <MainLayout showSearch={false}>
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/buscar">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a resultados
            </Link>
          </Button>
          <div className="text-center py-12">
            <h2 className="text-xl font-bold">Doctor no encontrado</h2>
            <p className="text-muted-foreground mt-2">
              El perfil que buscas no está disponible.
            </p>
          </div>
        </MainLayout>
      )
    }

    const doctorData = docSnap.data()

    return (
      <MainLayout showSearch={false}>
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/buscar">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver a resultados
          </Link>
        </Button>

        <DoctorProfile doctor={doctorData} />
      </MainLayout>
    )
  } catch (error) {
    console.error("Error fetching doctor data:", error)
    return (
      <MainLayout showSearch={false}>
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/buscar">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver a resultados
          </Link>
        </Button>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold">Error al cargar el perfil</h2>
          <p className="text-muted-foreground mt-2">
            Ocurrió un problema al cargar la información del doctor.
          </p>
        </div>
      </MainLayout>
    )
  }
}