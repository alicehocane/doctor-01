import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DoctorProfile from "@/components/doctor-profile"
import MainLayout from "@/components/main-layout"

interface DoctorPageProps {
  params: {
    id: string
  }
}

// This would be replaced with a server-side data fetch in a real app
export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  // Mock data for demonstration
  const doctorName = "Dr. Luis Felipe Aguilar Aguilar"
  const specialty = "Cardiólogo"

  return {
    title: `${doctorName} - ${specialty} | Directorio de Médicos`,
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
