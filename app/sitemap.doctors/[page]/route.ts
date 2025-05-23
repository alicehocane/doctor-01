
import { NextResponse } from 'next/server';
import { firestore } from '../lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 604800; // 7 days

/**
 * Dynamic paginated doctor sitemap.
 * @param params.page Page number of the sitemapss
 */
export async function GET(
  _: Request,
  { params }: { params: { page: string } }
) {
  const baseUrl = 'https://doctor-01.vercel.app';
  const pageSize = 500;
  const pageNum = parseInt(params.page, 10);
  const now = new Date().toISOString();

  try {
    const snapshot = await firestore
      .collection('doctors')
      .orderBy('createdAt')
      .offset((pageNum - 1) * pageSize)
      .limit(pageSize)
      .get();

    const urls = snapshot.docs.map(doc => {
      const data = doc.data();
      const lastmod = data.updatedAt
        ? data.updatedAt.toDate().toISOString()
        : now;

      return (
        `  <url>\n` +
        `    <loc>${baseUrl}/doctor/${doc.id}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `  </url>`
      );
    }).join("\n");

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls +
      `\n</urlset>`;

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (err: any) {
    console.error('Error fetching doctors for sitemap:', err);
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
