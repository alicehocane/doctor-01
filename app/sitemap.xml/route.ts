// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { formatISO }     from "date-fns";

const SITEMAPS = [
  "sitemap.static.xml",
  "sitemap.doctors.xml",
];

export async function GET() {
  const now = formatISO(new Date());
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${SITEMAPS.map((name) => `
    <sitemap>
      <loc>https://yourdomain.com/${name}</loc>
      <lastmod>${now}</lastmod>
    </sitemap>`).join("")}
</sitemapindex>`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml" },
  });
}

export function HEAD() {
  return GET();
}
