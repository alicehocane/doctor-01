// File: app/sitemap.doctors.xml/route.ts
import { MetadataRoute } from "next"
import { getFirestore } from "firebase-admin/firestore"
import { adminApp } from "@/lib/firebase-server" // adjust path if needed

export async function GET(): Promise<MetadataRoute.SitemapIndex> {
  const db = getFirestore(adminApp)

  try {
    // Efficiently count total doctors without fetching all docs
    const doctorsCollection = db.collection("doctors")
    const snapshot = await doctorsCollection.count().get()
    const totalDoctors = snapshot.data().count || 0

    const pageSize = 500
    const totalPages = Math.ceil(totalDoctors / pageSize)

    const urls = Array.from({ length: totalPages }).map((_, index) => ({
      url: `https://yourdomain.com/sitemap.doctors/${index + 1}`,
      lastModified: new Date(),
    }))

    return urls
  } catch (error) {
    console.error("Error generating doctors sitemap index:", error)
    return []
  }
}
