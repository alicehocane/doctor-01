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
  totalProcessed: number
  successCount: number
  errorCount: number
  errors: { doctor: string; error: string }[]
}

// Process a single doctor
async function processSingleDoctor(doctor: DoctorData): Promise<{ success: boolean; error?: string }> {
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
      throw new Error("Faltan campos requeridos o tienen formato incorrecto")
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

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}

// Process a chunk of doctors
export async function processChunk(chunk: DoctorData[]): Promise<UploadResult> {
  const result: UploadResult = {
    success: true,
    message: "",
    totalProcessed: chunk.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
  }

  // Process each doctor in the chunk
  for (const doctor of chunk) {
    const processResult = await processSingleDoctor(doctor)

    if (processResult.success) {
      result.successCount++
    } else {
      result.errorCount++
      result.errors.push({
        doctor: doctor.fullName || "Médico sin nombre",
        error: processResult.error || "Error desconocido",
      })
    }
  }

  // Set success based on results
  result.success = result.errorCount === 0

  return result
}

// Procesar un lote de doctores
export async function processBatch(batch: DoctorData[]): Promise<UploadResult> {
  const result: UploadResult = {
    success: true,
    message: "",
    totalProcessed: batch.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
  }

  // Procesar cada doctor en el lote
  for (const doctor of batch) {
    const processResult = await processSingleDoctor(doctor)

    if (processResult.success) {
      result.successCount++
    } else {
      result.errorCount++
      result.errors.push({
        doctor: doctor.fullName || "Médico sin nombre",
        error: processResult.error || "Error desconocido",
      })
    }
  }

  // Establecer éxito basado en resultados
  result.success = result.errorCount === 0

  // Revalidar la ruta después de procesar un lote
  revalidatePath("/admin/doctors")

  return result
}

// Validar el formato JSON
export async function validateJsonData(data: string): Promise<{
  valid: boolean
  message: string
  data?: DoctorData[]
}> {
  try {
    const parsed = JSON.parse(data)

    if (!Array.isArray(parsed)) {
      return {
        valid: false,
        message: "El formato de datos no es válido. Se esperaba un array de médicos.",
      }
    }

    return {
      valid: true,
      message: "Formato JSON válido",
      data: parsed,
    }
  } catch (error) {
    return {
      valid: false,
      message: "Error al analizar el JSON: " + (error as Error).message,
    }
  }
}
