// app/sitemap.static.xml/route.ts
import { NextResponse } from "next/server";
import { formatISO }     from "date-fns";

const PAGES = [
  { path: "/",        freq: "daily",   pri: "1.0" },
  { path: "/about",   freq: "monthly", pri: "0.7" },
  { path: "/contact", freq: "monthly", pri: "0.7" },
  // …add more static routes here
];

export async function GET() {
  const now = formatISO(new Date());
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${PAGES.map(({ path, freq, pri }) => `
    <url>
      <loc>https://yourdomain.com${path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${freq}</changefreq>
      <priority>${pri}</priority>
    </url>`).join("")}
</urlset>`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml" },
  });
}

export function HEAD() {
  return GET();
}
