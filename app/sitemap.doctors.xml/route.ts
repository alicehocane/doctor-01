// File: app/sitemap.doctors.xml/route.ts
import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { db } from '@/lib/firebase-server' // assuming you export db directly

export async function GET() {
  try {
    const doctorsCollection = db.collection("doctors")
    const snapshot = await doctorsCollection.count().get()
    const totalDoctors = snapshot.data().count || 0

    const pageSize = 500
    const totalPages = Math.ceil(totalDoctors / pageSize)

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from({ length: totalPages })
  .map((_, i) => {
    const url = `https://doctor-01.vercel.app/sitemap.doctors/${i + 1}`
    const lastmod = new Date().toISOString()
    return `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
  })
  .join('')}
</sitemapindex>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error("Error generating doctors sitemap index:", error)
    return new NextResponse('Failed to generate sitemap index', { status: 500 })
  }
}
