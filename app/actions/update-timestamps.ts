"use server"

import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function updateDoctorTimestamps() {
  try {
    if (!db) {
      throw new Error("Firestore is not initialized")
    }

    const doctorsRef = collection(db, "doctors")

    // Get all doctors
    const snapshot = await getDocs(doctorsRef)

    let updatedCount = 0
    let alreadyHadTimestamp = 0
    let errors = 0

    // Process each doctor
    const updatePromises = snapshot.docs.map(async (docSnapshot) => {
      const doctorData = docSnapshot.data()

      // Check if the doctor already has a createdAt field
      if (!doctorData.createdAt) {
        try {
          // Update the doctor with a timestamp
          await updateDoc(doc(db, "doctors", docSnapshot.id), {
            createdAt: serverTimestamp(),
          })
          updatedCount++
        } catch (error) {
          console.error(`Error updating doctor ${docSnapshot.id}:`, error)
          errors++
        }
      } else {
        alreadyHadTimestamp++
      }
    })

    // Wait for all updates to complete
    await Promise.all(updatePromises)

    return {
      success: true,
      message: `Operation completed. Updated ${updatedCount} doctors. ${alreadyHadTimestamp} already had timestamps. ${errors} errors.`,
    }
  } catch (error: any) {
    console.error("Error updating doctor timestamps:", error)
    return {
      success: false,
      message: `Error: ${error.message}`,
    }
  }
}
