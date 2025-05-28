import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DoctorProfile from "@/components/doctor-profile"
import MainLayout from "@/components/main-layout"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface DoctorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  // First try fetching from Firestore
  try {
    const docRef = doc(db, "doctors", params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const doctorData = docSnap.data();
      console.log('Doctor data:', doctorData); // Debugging log

      const doctorName = doctorData.fullName || `Dr. ${params.id.slice(0, 8)}`;
      const specialties = doctorData.specialties?.join(", ") || "Médico General";
      
      const title = `${doctorName} | Busca Doctor México`;
      const description = `Perfil profesional de ${doctorName}. ${specialties}. Información de contacto, direcciones y horarios.`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://www.buscadoctormexico.mx/doctor/${params.id}`,
          type: 'profile',
        },
        alternates: {
          canonical: `https://www.buscadoctormexico.mx/doctor/${params.id}`,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching doctor metadata:", error);
  }

  // Fallback 1: Try mock data if available
  const mockDoctors = {
    "WDONFz7u8gQm5Sslxd43": {
      fullName: "Dr. Luis Felipe Aguilar Aguilar",
      specialties: ["Cardiólogo", "Angiólogo"]
    }
    // Add other mock doctors if needed
  };

  if (mockDoctors[params.id]) {
    const doctor = mockDoctors[params.id];
    const title = `${doctor.fullName} | Busca Doctor México`;
    
    return {
      title,
      description: `Perfil de ${doctor.fullName}, ${doctor.specialties.join(", ")}`,
    };
  }

  // Final fallback
  return {
    title: "Perfil de Médico | Busca Doctor México",
    description: "Información profesional y de contacto del médico",
  };
}