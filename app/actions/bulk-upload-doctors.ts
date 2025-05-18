"use server"

import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateDoctorId, ensureUniqueDoctorId } from "@/lib/utils-doctor"
import { revalidatePath } from "next/cache"

type DoctorData = {
  fullName: string
  licenseNumber: string
  specialties: string[]
  focusedon?: string[]
  diseasesTreated?: string[]
  cities: string[]
  addresses?: string[]
  phoneNumbers: string[]
  [key: string]: any
}

type UploadResult = {
  success: boolean
  message: string
  successCount: number
  errorCount: number
  errors: { doctor: string; error: string }[]
}

// Procesar un solo doctor - función muy pequeña para evitar problemas de tamaño
export async function processSingleDoctor(doctor: DoctorData): Promise<UploadResult> {
  try {
    // Validate required fields
    if (
      !doctor.fullName ||
      !doctor.licenseNumber ||
      !doctor.specialties ||
      !doctor.cities ||
      !doctor.phoneNumbers ||
      !Array.isArray(doctor.specialties) ||
      !Array.isArray(doctor.cities) ||
      !Array.isArray(doctor.phoneNumbers)
    ) {
      return {
        success: false,
        message: "Faltan campos requeridos o tienen formato incorrecto",
        successCount: 0,
        errorCount: 1,
        errors: [
          {
            doctor: doctor.fullName || "Médico sin nombre",
            error: "Faltan campos requeridos o tienen formato incorrecto",
          },
        ],
      }
    }

    // Generate doctor ID
    const baseId = generateDoctorId(doctor.fullName)
    const doctorId = await ensureUniqueDoctorId(baseId)

    // Add timestamp and ID
    const doctorWithMeta = {
      ...doctor,
      doctorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Save to Firestore
    const docRef = doc(collection(db, "doctors"))
    await setDoc(docRef, doctorWithMeta)

    // Revalidate path after successful addition
    revalidatePath("/admin/doctors")

    return {
      success: true,
      message: "Médico añadido correctamente",
      successCount: 1,
      errorCount: 0,
      errors: [],
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      successCount: 0,
      errorCount: 1,
      errors: [
        {
          doctor: doctor.fullName || "Médico sin nombre",
          error: (error as Error).message,
        },
      ],
    }
  }
}

// Validar el formato JSON - función muy pequeña
export async function validateJson(jsonString: string): Promise<{
  valid: boolean
  message: string
}> {
  try {
    JSON.parse(jsonString)
    return { valid: true, message: "JSON válido" }
  } catch (error) {
    return {
      valid: false,
      message: "Error al analizar el JSON: " + (error as Error).message,
    }
  }
}
