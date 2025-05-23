// app/sitemap.doctors/[page]/route.ts
'use server'

import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 604800; // 7 days

export async function GET(
  _: Request,
  { params }: { params: { page: string } }
) {
  const baseUrl = 'https://doctor-01.vercel.app';
  const pageSize = 500;
  const pageNum = parseInt(params.page, 10);
  const now = new Date().toISOString();

  try {
    let query = firestore
      .collection('doctors')
      .orderBy('createdAt')
      .offset((pageNum - 1) * pageSize)
      .limit(pageSize);

    const snapshot = await query.get();
    const urls = snapshot.docs.map(doc => {
      const data = doc.data();
      const lastmod = data.updatedAt
        ? data.updatedAt.toDate().toISOString()
        : now;

      return `  <url>
    <loc>${baseUrl}/doctor/${doc.id}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    });

    const urlset = urls.join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (err: any) {
    console.error('Error fetching doctors for sitemap:', err);
    // Fallback to empty sitemap on error
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}