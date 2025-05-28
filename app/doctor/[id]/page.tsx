import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DoctorProfile from "@/components/doctor-profile"
import MainLayout from "@/components/main-layout"
import { getServerDoc } from "@/lib/firebase-server" // <-- import helper

interface DoctorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { id } = params

  const doctor = await getServerDoc("doctors", id)

  if (!doctor) {
    return {
      title: "Doctor no encontrado | Busca Doctor México",
      description: "Este perfil de doctor no está disponible.",
    }
  }

  const doctorName = doctor.name || "Doctor desconocido"
  const specialty = doctor.specialty || "Especialidad no disponible"

  return {
    title: `${doctorName} - ${specialty} | Busca Doctor México`,
    description: `Información de contacto y perfil profesional de ${doctorName}, ${specialty} en México.`,
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
