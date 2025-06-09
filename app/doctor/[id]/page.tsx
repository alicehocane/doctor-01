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
  let doctor;
  
  try {
    doctor = await getDoctorData(params.id);
    
    if (!doctor?.fullName) {
      console.error('Doctor data missing fullName:', doctor);
      return {
        title: "Perfil Médico | Busca Doctor México",
        description: "Información de contacto y perfil profesional del médico."
      };
    }

    const primarySpecialty = doctor.specialties?.[0] || 'Médico';
    const specialtiesText = doctor.specialties?.join(', ') || 'médico especialista';

    return {
      title: `${doctor.fullName} - ${primarySpecialty} | Busca Doctor México`,
      description: `Información de contacto y perfil profesional de ${doctor.fullName}, ${specialtiesText} en México.`,
      openGraph: {
        title: `${doctor.fullName} | Busca Doctor México`,
        description: `Perfil profesional de ${doctor.fullName}, ${specialtiesText}`,
        url: `/doctor/${params.id}`,
        type: 'profile',
      },
      alternates: {
        canonical: `/doctor/${params.id}`
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Perfil Médico | Busca Doctor México",
      description: "Información de contacto y perfil profesional del médico."
    };
  }
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await getDoctorData(params.id);

  // Debug output - check your server logs
  console.log('Rendering doctor page with data:', {
    id: params.id,
    hasData: !!doctor,
    name: doctor?.fullName,
    specialties: doctor?.specialties
  });

  if (!doctor) {
    return (
      <MainLayout showSearch={false}>
        <div className="text-center py-10">
          <h2>Doctor no encontrado</h2>
          <Button asChild className="mt-4">
            <Link href="/buscar">Volver a buscar</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

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

