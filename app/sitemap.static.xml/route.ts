import { NextResponse } from 'next/server';

/**
 * Static routes sitemap.
 */
export async function GET() {
  const baseUrl = 'https://doctor-01.vercel.app';
  const now = new Date().toISOString();

  const urls = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.7 },
  ];

  const urlset = urls
    .map(
      ({ loc, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}