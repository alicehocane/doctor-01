// app/doctor/[id]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorProfile from "@/components/doctor-profile";
import MainLayout from "@/components/main-layout";

// 1) Import Firestore from your admin setup
import { firestore } from "@/lib/firebase-admin";

interface DoctorPageProps {
  params: {
    id: string;
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// 2) generateMetadata: fetch real data from Firestore (Admin SDK)
// ──────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { id } = params;

  try {
    // Reference the “doctors/{id}” document in Firestore
    const referenciaDocumento = firestore.collection("doctors").doc(id);
    const documentoSnapshot = await referenciaDocumento.get();

    if (!documentoSnapshot.exists) {
      // If the document does not exist, return a generic “not found” head
      return {
        title: "Doctor no encontrado | Busca Doctor México",
        description: "No se pudo encontrar el perfil del doctor especificado.",
      };
    }

    // Extract data fields from the document
    const datos = documentoSnapshot.data()!;
    // `fullName` must be a string
    const nombreCompleto: string =
      typeof datos.fullName === "string" ? datos.fullName : "Sin nombre";

    // `specialties` is expected to be an array of strings; pick the first one or fallback
    const arregloEspecialidades: unknown = datos.specialties;
    const listaEspecialidades: string[] = Array.isArray(arregloEspecialidades)
      ? (arregloEspecialidades as string[])
      : [];
    const especialidad: string =
      listaEspecialidades.length > 0 ? listaEspecialidades[0] : "Especialidad desconocida";

    // Return a dynamic <title> and <meta description>
    return {
      title: `${nombreCompleto} – ${especialidad} | Busca Doctor México`,
      description: `Perfil y contacto de ${nombreCompleto}, especialista en ${especialidad}.`,
    };
  } catch (error: any) {
    // If any error occurs (e.g. missing credentials, network), log it and fallback
    console.error(
      "[generateMetadata] Error fetching doctor id=",
      id,
      " — error code/message:",
      error.code || error.message || error
    );
    return {
      title: "Error cargando datos | Busca Doctor México",
      description: "Hubo un error al intentar cargar la información del doctor.",
    };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 3) Page component: render the same layout/UI as before
// ──────────────────────────────────────────────────────────────────────────────
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
        DoctorProfile can still fetch additional details (direcciones, teléfonos, etc.)
        in a client-side useEffect. But the <title> is already set above.
      */}
      <DoctorProfile id={id} />
    </MainLayout>
  );
}
