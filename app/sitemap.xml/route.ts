'use server';
import { NextResponse } from 'next/server';

/**
 * Sitemap index referencing static and doctors sitemaps.
 */
export async function GET() {
  const baseUrl = 'https://doctor-01.vercel.app';
  const staticSitemap = `${baseUrl}/sitemap.static.xml`;
  const doctorsSitemap = `${baseUrl}/sitemap.doctors.xml`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${staticSitemap}</loc>
  </sitemap>
  <sitemap>
    <loc>${doctorsSitemap}</loc>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}