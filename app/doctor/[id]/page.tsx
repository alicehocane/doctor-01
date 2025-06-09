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

function addDoctorJsonLd(doctor: any) {
  if (!doctor) return null;
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `https://www.buscadoctor.mx/doctor/${doctor.id}`,
    "name": doctor.fullName,
    "description": `Perfil profesional de ${doctor.fullName}, ${doctor.specialties?.join(', ') || 'médico especialista'} en México.`,
    "url": `https://www.buscadoctor.mx/doctor/${doctor.id}`,
    "medicalSpecialty": doctor.specialties?.map((specialty: string) => ({
      "@type": "MedicalSpecialty",
      "name": specialty
    })),
    "address": doctor.cities?.map((city: string) => ({
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "MX"
    })),
    "telephone": doctor.phoneNumbers?.[0],
    "sameAs": doctor.socialLinks || []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await getDoctorData(params.id);

  return (
    <MainLayout showSearch={false}>
      {/* Add JSON-LD structured data */}
      {addDoctorJsonLd(doctor)}
      
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