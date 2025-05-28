import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DoctorProfile from "@/components/doctor-profile"
import MainLayout from "@/components/main-layout"

interface DoctorPageProps {
  params: {
    id: string
  }
}

// This would be replaced with a server-side data fetch in a real app
export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  // Initialize Firebase Admin (you might need to import your firebase admin setup)
  const db = getFirestore();
  
  try {
    // Fetch doctor data from Firestore
    const docRef = doc(db, "doctors", params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Doctor not found");
    }

    const doctorData = docSnap.data();
    const doctorName = doctorData.name || "Doctor";
    const specialty = doctorData.specialty || "Especialidad no especificada";

    return {
      title: `${doctorName} - ${specialty} | Busca Doctor México`,
      description: `Información de contacto y perfil profesional de ${doctorName}, ${specialty} en México.`,
    };
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    // Fallback metadata if there's an error
    return {
      title: "Doctor | Busca Doctor México",
      description: "Perfil profesional del doctor en México.",
    };
  }
}