// File: app/sitemap.doctors/[page]/route.ts
import { db } from "@/lib/firebase-server"
import { collection, getDocs, query, orderBy, limit, startAt } from "firebase/firestore"
import { MetadataRoute } from "next"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
): Promise<MetadataRoute.Sitemap> {
  const pageSize = 500
  const page = parseInt(params.page)

  if (isNaN(page) || page < 1) {
    return []
  }

  const allDoctorsSnapshot = await getDocs(query(collection(db, "doctors"), orderBy("createdAt")))
  const startIndex = (page - 1) * pageSize
  const endIndex = page * pageSize

  const pageDocs = allDoctorsSnapshot.docs.slice(startIndex, endIndex)

  const urls = pageDocs.map((doc) => {
    const doctor = doc.data()
    return {
      url: `https://yourdomain.com/doctor/${doc.id}`,
      lastModified: doctor.updatedAt ? new Date(doctor.updatedAt.toDate()) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }
  })

  return urls
}
