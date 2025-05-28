import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorProfile from "@/components/doctor-profile";
import MainLayout from "@/components/main-layout";
import { getDoctorData } from "@/lib/get-doctor";

interface DoctorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const doctor = await getDoctorData(params.id);
  
  if (!doctor) {
    return {
      title: "Perfil Médico | Busca Doctor México",
      description: "Información de contacto y perfil profesional del médico."
    };
  }

  return {
    title: `${doctor.fullName} - ${doctor.specialties?.[0] || 'Médico'} | Busca Doctor México`,
    description: `Información de contacto y perfil profesional de ${doctor.fullName}, ${doctor.specialties?.join(', ') || 'médico especialista'} en México.`,
    openGraph: {
      title: `${doctor.fullName} | Busca Doctor México`,
      description: `Perfil profesional de ${doctor.fullName}`,
      // Add other OG tags as needed
    }
  };
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await getDoctorData(params.id);

  return (
    <MainLayout showSearch={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/buscar">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver a resultados
        </Link>
      </Button>

      <DoctorProfile id={params.id} initialData={doctor} />
    </MainLayout>
  );
}