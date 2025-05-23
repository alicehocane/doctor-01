import { MetadataRoute } from "next"
import { adminDb } from "@/lib/firebaseAdmin"

export default async function sitemap({ params }: { params: { page: string } }): Promise<MetadataRoute.Sitemap> {
  const page = parseInt(params.page, 10)
  const pageSize = 500
  const offset = (page - 1) * pageSize

  const snapshot = await adminDb.collection("doctors")
    .orderBy("slug")
    .offset(offset)
    .limit(pageSize)
    .get()

  const urls = snapshot.docs.map(doc => ({
    url: `https://yourdomain.com/doctors/${doc.data().slug}`,
    lastModified: doc.updateTime?.toDate(),
  }))

  return urls
}

export function HEAD() { return GET() }
