// app/sitemap.doctors.xml/route.ts
import { NextResponse }  from "next/server";
import { formatISO }      from "date-fns";
import { db }             from "@/lib/firebase-server";

const PAGE_SIZE = 500;

export async function GET() {
  // Fetch all doctor documents and count
  const snapshot = await db.collection("doctors").get();
  const total    = snapshot.size;
  const pages    = Math.ceil(total / PAGE_SIZE);
  const now      = formatISO(new Date());

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${Array.from({ length: pages }).map((_, i) => `
    <sitemap>
      <loc>https://yourdomain.com/sitemap.doctors/${i + 1}</loc>
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