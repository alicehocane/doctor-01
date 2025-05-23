// app/sitemap.doctors/[page]/route.ts
import { NextResponse }  from "next/server";
import { formatISO }      from "date-fns";
import { db }             from "@/lib/firebase-server";

const PAGE_SIZE = 500;

export async function GET({ params }: { params: { page: string } }) {
  const page   = Math.max(1, parseInt(params.page, 10));
  const offset = (page - 1) * PAGE_SIZE;
  const now    = formatISO(new Date());

  const snap = await db
    .collection("doctors")
    .orderBy("slug")
    .offset(offset)
    .limit(PAGE_SIZE)
    .get();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${snap.docs.map(doc => `
    <url>
      <loc>https://yourdomain.com/doctors/${doc.data().slug}</loc>
      <lastmod>${formatISO(doc.updateTime!.toDate())}</lastmod>
    </url>`).join("")}
</urlset>`;

  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml" },
  });
}

export function HEAD() {
  return GET(arguments[0]);
}
