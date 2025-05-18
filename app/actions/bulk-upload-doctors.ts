"use server"

import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateDoctorId, ensureUniqueDoctorId } from "@/lib/utils-doctor"

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

export async function bulkUploadDoctors(data: string): Promise<UploadResult> {
  try {
    // Parse the JSON data
    let doctors: DoctorData[]
    try {
      doctors = JSON.parse(data)
      if (!Array.isArray(doctors)) {
        return {
          success: false,
          message: "El formato de datos no es válido. Se esperaba un array de médicos.",
          totalProcessed: 0,
          successCount: 0,
          errorCount: 1,
          errors: [{ doctor: "N/A", error: "El formato de datos no es válido. Se esperaba un array de médicos." }],
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Error al analizar el JSON: " + (error as Error).message,
        totalProcessed: 0,
        successCount: 0,
        errorCount: 1,
        errors: [{ doctor: "N/A", error: "Error al analizar el JSON: " + (error as Error).message }],
      }
    }

    // Initialize result
    const result: UploadResult = {
      success: true,
      message: "",
      totalProcessed: doctors.length,
      successCount: 0,
      errorCount: 0,
      errors: [],
    }

    // Process each doctor
    for (const doctor of doctors) {
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

        result.successCount++
      } catch (error) {
        result.errorCount++
        result.errors.push({
          doctor: doctor.fullName || "Médico sin nombre",
          error: (error as Error).message,
        })
      }
    }

    // Set final message
    if (result.errorCount === 0) {
      result.message = `Se procesaron ${result.successCount} médicos correctamente.`
    } else {
      result.message = `Se procesaron ${result.successCount} médicos correctamente. Hubo ${result.errorCount} errores.`
      result.success = result.successCount > 0 // Only consider it a success if at least one doctor was processed
    }

    return result
  } catch (error) {
    return {
      success: false,
      message: "Error en el proceso de carga: " + (error as Error).message,
      totalProcessed: 0,
      successCount: 0,
      errorCount: 1,
      errors: [{ doctor: "N/A", error: "Error en el proceso de carga: " + (error as Error).message }],
    }
  }
}
