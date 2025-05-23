// app/sitemap.ts
// Disable static prerendering: generate dynamically to avoid quota at build
export const dynamic = 'force-dynamic';
// Revalidate once per day (86400 seconds)
export const revalidate = 86400;

import type { MetadataRoute } from "next";
import { db } from "@/lib/firebase-server";

const SITE_URL = process.env.SITE_URL ?? "https://yourdomain.com";
const DOCTORS_PAGE_SIZE = 50000;

// Generate sitemap shard IDs based on doctor count
export async function generateSitemaps(): Promise<{ id: number }[]> {
  // Aggregate count instead of full document fetch
  const agg = await db.collection("doctors").count().get();
  const total = agg.data().count ?? 0;
  const pages = Math.ceil(total / DOCTORS_PAGE_SIZE);
  return Array.from({ length: pages }, (_, i) => ({ id: i + 1 }));
}

// Build each sitemap shard (static + doctors)
export default async function sitemap({
  params,
}: {
  params: { id: string };
}): Promise<MetadataRoute.Sitemap> {
  const id = parseInt(params.id, 10);
  const urls: MetadataRoute.Sitemap = [];

  // Include static pages in first shard
  if (id === 1) {
    urls.push(
      {
        url: `${SITE_URL}/`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${SITE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }
    );
  }

  // Fetch doctor pages for this shard
  const offset = (id - 1) * DOCTORS_PAGE_SIZE;
  const snap = await db
    .collection("doctors")
    .orderBy("slug")
    .offset(offset)
    .limit(DOCTORS_PAGE_SIZE)
    .get();

  snap.docs.forEach((doc) => {
    const data = doc.data();
    urls.push({
      url: `${SITE_URL}/doctors/${data.slug}`,
      lastModified: doc.updateTime?.toDate() ?? new Date(),
    });
  });

  return urls;
}
