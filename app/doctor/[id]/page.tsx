import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorProfile from "@/components/doctor-profile";
import MainLayout from "@/components/main-layout";
import { getDoctorData } from "@/lib/get-doctor";

interface DoctorPageProps {
  params: { id: string };
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
    title: `${doctor.fullName} - ${doctor.specialties?.[0] || "Médico"} | Busca Doctor México`,
    description: `Información de contacto y perfil profesional de ${doctor.fullName}, ${doctor.specialties?.join(", ") || "médico especialista"} en México.`,
    openGraph: {
      title: `${doctor.fullName} | Busca Doctor México`,
      description: `Perfil profesional de ${doctor.fullName}`
    }
  };
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await getDoctorData(params.id);

  if (!doctor) {
    // Trigger the built-in 404 page
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.fullName,
    url: `https://buscadoctormexico.com/doctor/${doctor.id}`,
    ...(doctor.photoUrl && { image: doctor.photoUrl }),
    description: `Perfil profesional de ${doctor.fullName}, especialista en ${doctor.specialties?.join(", ")}`,
    medicalSpecialty: doctor.specialties,
    ...(doctor.cities?.length > 0 && {
      address: {
        "@type": "PostalAddress",
        addressLocality: doctor.cities[0]
      }
    }),
    ...(doctor.phoneNumbers?.length > 0 && { telephone: doctor.phoneNumbers[0] })
  };

  return (
    <>
      {/* JSON‑LD for SEO */}
      <Script
        id="physician-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(schema)}
      </Script>

      <MainLayout showSearch={false}>
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/buscar">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver a resultados
          </Link>
        </Button>

        <DoctorProfile id={params.id} initialData={doctor} />
      </MainLayout>
    </>
  );
}
