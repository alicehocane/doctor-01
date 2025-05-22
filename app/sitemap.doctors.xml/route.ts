import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "doctors"))

    const urls = snapshot.docs.map((doc) => {
      const data = doc.data()

      // Fallback to current date if updatedAt is missing or not valid
      let lastMod = new Date()
      try {
        if (data.updatedAt?.toDate) {
          lastMod = data.updatedAt.toDate()
        }
      } catch (e) {
        console.warn(`Invalid updatedAt for doc ${doc.id}`)
      }

      return `
<url>
  <loc>https://doctor-01.vercel.app/doctor/${doc.id}</loc>
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
  } catch (error: any) {
    console.error("❌ Error generating doctors sitemap:", error)
    return new NextResponse("Error generating sitemap", { status: 500 })
  }
}
