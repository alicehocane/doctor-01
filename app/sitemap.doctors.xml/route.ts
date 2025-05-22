import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "doctors"))

    const urls = snapshot.docs.map((doc) => {
      const data = doc.data()
      const lastMod = data.updatedAt?.toDate?.() || new Date()
      return `
<url>
  <loc>https://yourdomain.com/doctor/${doc.id}</loc>
  <lastmod>${lastMod.toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>`
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  } catch (error) {
    console.error("Failed to generate doctors sitemap:", error)
    return new NextResponse("Error generating sitemap", { status: 500 })
  }
}
