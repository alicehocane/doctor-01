import { type NextRequest, NextResponse } from "next/server"
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateDoctorId, ensureUniqueDoctorId } from "@/lib/utils-doctor"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    // Obtener un solo médico de la solicitud
    const medico = await request.json()

    // Validar campos requeridos
    if (
      !medico.fullName ||
      !medico.licenseNumber ||
      !medico.specialties ||
      !medico.cities ||
      !medico.phoneNumbers ||
      !Array.isArray(medico.specialties) ||
      !Array.isArray(medico.cities) ||
      !Array.isArray(medico.phoneNumbers)
    ) {
      return NextResponse.json(
        {
          exito: false,
          mensaje: "Faltan campos requeridos o formato incorrecto",
        },
        { status: 400 },
      )
    }

    // Generar ID del médico
    const idBase = generateDoctorId(medico.fullName)
    const doctorId = await ensureUniqueDoctorId(idBase)

    // Añadir timestamp e ID
    const medicoConMeta = {
      ...medico,
      doctorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Guardar en Firestore
    const docRef = doc(collection(db, "doctors"))
    await setDoc(docRef, medicoConMeta)

    // Revalidar la ruta de médicos
    revalidatePath("/admin/doctors")

    return NextResponse.json({
      exito: true,
      mensaje: "Médico añadido correctamente",
      doctorId,
    })
  } catch (error) {
    console.error("Error al añadir médico:", error)
    return NextResponse.json(
      {
        exito: false,
        mensaje: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
