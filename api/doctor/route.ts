import { type NextRequest, NextResponse } from "next/server"
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateDoctorId, ensureUniqueDoctorId } from "@/lib/utils-doctor"

export async function POST(request: NextRequest) {
  try {
    // Get a single doctor from the request
    const doctor = await request.json()

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
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields or incorrect format",
        },
        { status: 400 },
      )
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

    return NextResponse.json({
      success: true,
      message: "Doctor added successfully",
      doctorId,
    })
  } catch (error) {
    console.error("Error adding doctor:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
