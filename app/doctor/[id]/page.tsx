import type { Metadata } from "next"
import { firestore } from "@/lib/firebase-admin"
import { doc, getDoc } from "firebase-admin/firestore" // note: admin SDK

interface DoctorPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const { id } = params

  try {
    const docRef = firestore.collection("doctors").doc(id)
    const snapshot = await docRef.get()

    if (!snapshot.exists) {
      return {
        title: "Doctor no encontrado | Busca Doctor México",
        description: "Este perfil de doctor no está disponible.",
      }
    }

    const data = snapshot.data()
    const doctorName = data?.name || "Doctor desconocido"
    const specialty = data?.specialty || "Especialidad no disponible"

    return {
      title: `${doctorName} - ${specialty} | Busca Doctor México`,
      description: `Información de contacto y perfil profesional de ${doctorName}, ${specialty} en México.`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)

    return {
      title: "Error al cargar doctor | Busca Doctor México",
      description: "Hubo un problema al cargar la información del doctor.",
    }
  }
}
