import { NextResponse } from 'next/server';
import { firestore } from '../../lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 604800; // 7 days

/**
 * Generates a sitemap index of paginated doctor sitemaps.
 */
export async function GET() {
  const baseUrl = 'https://doctor-01.vercel.app';
  const now = new Date().toISOString();
  let totalDocs = 0;

  try {
    const agg = await firestore.collection('doctors').count().get();
    totalDocs = agg.data().count;
  } catch (err: any) {
    console.error('Error counting doctors:', err);
    totalDocs = 500;
  }

  const pageSize = 500;
  const totalPages = Math.ceil(totalDocs / pageSize);

  const sitemaps = Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    return `  <sitemap>
    <loc>${baseUrl}/sitemap.doctors/${page}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
