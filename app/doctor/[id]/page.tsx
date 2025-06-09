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
  try {
    const doctor = await getDoctorData(params.id);
    
    if (!doctor || !doctor.fullName) {
      console.error('Doctor data missing:', { id: params.id, doctor });
      return {
        title: "Perfil Médico | Busca Doctor México",
        description: "Información de contacto y perfil profesional del médico.",
      };
    }

    // // Debug output to verify data
    // console.log('Doctor metadata data:', {
    //   name: doctor.fullName,
    //   specialties: doctor.specialties,
    //   cities: doctor.cities
    // });

    const specialty = doctor.specialties?.[0] || 'Médico';
    const location = doctor.cities?.[0] ? `en ${doctor.cities[0]}` : 'en México';

    return {
      title: `${doctor.fullName} - ${specialty} | Busca Doctor México`,
      description: `Información de contacto y perfil profesional de ${doctor.fullName}, ${specialty} ${location}.`,
      alternates: {
        canonical: `/doctor/${params.id}`
      },
      openGraph: {
        title: `${doctor.fullName} | Busca Doctor México`,
        description: `Perfil profesional de ${doctor.fullName}, ${specialty} ${location}`,
        url: `/doctor/${params.id}`,
        type: 'profile',
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

function generateDoctorSchema(doctor: any) {
  if (!doctor || !doctor.fullName) return '';

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": `Dr. ${doctor.fullName}`,
    "description": `Servicios médicos de ${doctor.fullName}, ${doctor.specialties?.[0] || 'especialista'} en México`,
    "url": `https://www.buscadoctor.mx/doctor/${doctor.id}`,
    "medicalSpecialty": doctor.specialties?.map((spec: string) => ({
      "@type": "MedicalSpecialty",
      "name": spec
    })),
    "address": doctor.addresses?.map((city: string) => ({
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": "Mexico",
      "addressCountry": "MX"
    })),
    "telephone": doctor.phoneNumbers?.[0]
  });
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await getDoctorData(params.id);

  // // Debug output to verify data
  // console.log('Doctor page data:', {
  //   id: params.id,
  //   hasData: !!doctor,
  //   name: doctor?.fullName,
  //   specialties: doctor?.specialties
  // });

  return (
    <MainLayout showSearch={false}>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateDoctorSchema(doctor) }}
      />
      
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