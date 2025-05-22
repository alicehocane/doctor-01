// pages/api/sitemap.doctors.xml.ts
import { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    res.setHeader("Content-Type", "application/xml")
    res.write(xml)
    res.end()
  } catch (error) {
    console.error("Error generating doctors sitemap:", error)
    res.status(500).end()
  }
}
