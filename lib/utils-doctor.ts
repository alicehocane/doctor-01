import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"

/**
 * Generates a URL-friendly ID from a doctor's name
 * @param name The doctor's full name
 * @returns A URL-friendly ID
 */
export function generateDoctorId(name: string): string {
  // Remove titles like "Dr." and "Dra."
  let cleanName = name.replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, "")

  // Convert to lowercase
  cleanName = cleanName.toLowerCase()

  // Remove accents
  cleanName = cleanName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  // Replace spaces and special characters with hyphens
  cleanName = cleanName.replace(/[^a-z0-9]+/g, "-")

  // Remove leading and trailing hyphens
  cleanName = cleanName.replace(/^-+|-+$/g, "")

  return cleanName
}

/**
 * Ensures a doctor ID is unique by checking against existing IDs
 * @param baseId The base ID generated from the doctor's name
 * @returns A unique ID
 */
export async function ensureUniqueDoctorId(baseId: string): Promise<string> {
  let id = baseId
  let counter = 1
  let isUnique = false

  while (!isUnique) {
    // Check if the ID already exists
    const doctorsRef = collection(db, "doctors")
    const q = query(doctorsRef, where("doctorId", "==", id))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      isUnique = true
    } else {
      // If the ID exists, append a number and try again
      id = `${baseId}-${counter}`
      counter++
    }
  }

  return id
}
