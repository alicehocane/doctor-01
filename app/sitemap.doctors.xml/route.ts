// app/sitemap.doctors.xml/route.ts  <-- Doctor sitemap index (paginated)
import { MetadataRoute } from "next"
import { adminDb } from "@/lib/firebaseAdmin"

export default async function sitemap(): Promise<MetadataRoute.SitemapIndex> {
  // Count total doctor documents
  const snapshot = await adminDb.collection("doctors").count().get()
  const total = snapshot.data().count ?? 0
  const pageSize = 500
  const pages = Math.ceil(total / pageSize)

  // Generate sitemap index entries for each page
  return Array.from({ length: pages }).map((_, i) => ({
    url: `https://yourdomain.com/sitemap.doctors/${i + 1}`,
    lastModified: new Date(),
  }))
}