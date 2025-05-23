// File: app/sitemap.doctors.xml/route.ts
import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase-server'

export async function GET() {
  const db = getFirestore(adminApp)

  try {
    const doctorsCollection = db.collection('doctors')
    const snapshot = await doctorsCollection.count().get()
    const totalDoctors = snapshot.data().count || 0

    const pageSize = 500
    const totalPages = Math.ceil(totalDoctors / pageSize)

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Array.from({ length: totalPages }).map((_, i) => `
        <sitemap>
          <loc>https://doctor-01.vercel.app/sitemap.doctors/${i + 1}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>`).join('')}
    </sitemapindex>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
