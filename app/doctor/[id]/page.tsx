// app/doctor/[id]/page.tsx
import { getServerDoc } from "@/lib/firebase-server";

export async function generateMetadata({ params }: DoctorPageProps) {
  const doctor = await getServerDoc("doctors", params.id);
  
  return {
    title: doctor 
      ? `${doctor.fullName} | Busca Doctor México` 
      : "Perfil de Médico",
    description: doctor
      ? `Perfil profesional de ${doctor.fullName}, ${doctor.specialties?.join(', ') || 'Especialista'}`
      : "Información de contacto del médico",
    alternates: {
      canonical: `https://www.buscadoctormexico.mx/doctor/${params.id}`,
    },
  };
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const doctor = await getServerDoc("doctors", params.id);

  return (
    <MainLayout showSearch={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/buscar">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver a resultados
        </Link>
      </Button>
      <DoctorProfile initialData={doctor} id={params.id} />
    </MainLayout>
  );
}