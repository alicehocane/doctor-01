// app/doctor/[id]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorProfile from "@/components/doctor-profile";
import MainLayout from "@/components/main-layout";

// 1) Import Firestore from your Admin SDK
import { firestore } from "@/lib/firebase-admin";

interface DoctorPageProps {
  params: {
    id: string;
  };
}

// -----------------------------------------------------
// 2) generateMetadata: fetch real data from Firestore
// -----------------------------------------------------
export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { id } = params;

  try {
    // Reference the “doctors/{id}” document in Firestore
    const docRef = firestore.collection("doctors").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      // If no document found, return a generic “not found” head
      return {
        title: "Doctor no encontrado | Busca Doctor México",
        description: "No se pudo encontrar el perfil del doctor especificado.",
      };
    }

    // Data exists: extract fields
    const datos = docSnap.data()!;
    // fullName is expected to be a string
    const nombreCompleto: string =
      typeof datos.fullName === "string" ? datos.fullName : "Sin nombre";

    // specialties is expected to be an array of strings; pick first or fallback
    const arregloEspecialidades: unknown = datos.specialties;
    const listaEspecialidades: string[] = Array.isArray(arregloEspecialidades)
      ? (arregloEspecialidades as string[])
      : [];
    const especialidad: string =
      listaEspecialidades.length > 0 ? listaEspecialidades[0] : "Especialidad desconocida";

    return {
      title: `${nombreCompleto} – ${especialidad} | Busca Doctor México`,
      description: `Perfil y contacto de ${nombreCompleto}, especialista en ${especialidad}.`,
    };
  } catch (error) {
    // If something goes wrong (permission issues, network), log and fallback
    console.error("Error fetching metadata for doctor id=", id, ":", error);
    return {
      title: "Error cargando datos | Busca Doctor México",
      description: "Hubo un error al intentar cargar la información del doctor.",
    };
  }
}

// ----------------------------------------------------
// 3) Default export: render your page/UI as before
// ----------------------------------------------------
export default function DoctorPage({ params }: DoctorPageProps) {
  const { id } = params;

  return (
    <MainLayout showSearch={false}>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/buscar">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver a resultados
        </Link>
      </Button>

      {/* 
        DoctorProfile can still do a client‐side fetch (useEffect) 
        to load addresses, phoneNumbers, etc. But the <title> in <head>
        is already provided by generateMetadata above.
      */}
      <DoctorProfile id={id} />
    </MainLayout>
  );
}
