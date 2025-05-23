// File: app/sitemap.doctors/[page]/route.ts
import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { adminApp } from '@/lib/firebase-server'

export async function GET(req: Request, { params }: { params: { page: string } }) {
  const db = getFirestore(adminApp)
  const page = parseInt(params.page)
  const pageSize = 500

  if (isNaN(page) || page < 1) {
    return new NextResponse('Invalid page number', { status: 400 })
  }

  try {
    const doctorsQuery = await db
      .collection('doctors')
      .orderBy('name') // adjust if needed
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${doctorsQuery.docs.map(doc => {
        return `
        <url>
          <loc>https://doctor-01.vercel.app/doctor/${doc.id}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </url>`
      }).join('')}
    </urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Error fetching paginated sitemap:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
