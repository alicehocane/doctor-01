import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DoctorProfile from "@/components/doctor-profile"
import MainLayout from "@/components/main-layout"
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DoctorPageProps {
  params: {
    id: string
  }
}

// This would be replaced with a server-side data fetch in a real app
export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  try {
    const docRef = doc(db, "doctors", params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const doctorData = docSnap.data();
      return {
        title: `${doctorData.fullName} - ${doctorData.specialties[0]} | Busca Doctor México`,
        description: `Información de contacto y perfil profesional de ${doctorData.fullName}, ${doctorData.specialties.join(', ')} en México.`,
      };
    }
  } catch (error) {
    console.error("Error fetching doctor metadata:", error);
  }

  // Fallback metadata if fetch fails
  return {
    title: `Perfil Médico | Busca Doctor México`,
    description: `Información de contacto y perfil profesional del médico.`,
  };
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