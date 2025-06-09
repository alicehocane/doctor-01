import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorProfile from "@/components/doctor-profile";
import MainLayout from "@/components/main-layout";
import { getCachedDoctorData } from '@/lib/cached-doctor';


interface DoctorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  try {
    const doctor = await getCachedDoctorData(params.id);
    
    if (!doctor) {
      return {
        title: "Perfil Médico | Busca Doctor México",
        description: "Información de contacto y perfil profesional del médico.",
        robots: {
          index: false,
          follow: true
        }
      };
    }

    const specialty = doctor.specialties[0] || 'Médico';
    const location = doctor.cities[0] ? `en ${doctor.cities[0]}` : '';

    return {
      title: `${doctor.fullName} - ${specialty} ${location} | Busca Doctor México`,
      description: `Perfil profesional de ${doctor.fullName}, ${specialty} ${location}. ${doctor.phoneNumbers[0] ? `Contacto: ${doctor.phoneNumbers[0]}` : ''}`,
      alternates: {
        canonical: `/doctor/${params.id}`
      },
      openGraph: {
        type: 'profile',
        profile: {
          firstName: doctor.fullName.split(' ')[0],
          lastName: doctor.fullName.split(' ').slice(1).join(' '),
        }
      }
    };
  } catch (error) {
    console.error('Metadata generation failed:', error);
    return {
      title: "Perfil Médico | Busca Doctor México",
      description: "Información de contacto y perfil profesional del médico.",
      robots: {
        index: false,
        follow: true
      }
    };
  }
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await getCachedDoctorData(params.id);

  if (!doctor) {
    return (
      <MainLayout showSearch={false}>
        <div className="text-center py-10">
          <h2>Doctor no encontrado</h2>
          <p className="text-muted-foreground mb-4">
            No se encontró el perfil médico solicitado.
          </p>
          <Button asChild>
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