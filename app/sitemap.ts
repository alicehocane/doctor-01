// app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/lib/firebase-server";

const SITE_URL = process.env.SITE_URL ?? "https://yourdomain.com";

// Generate sitemap index entries (one per paginated sitemap)
export async function generateSitemaps() {
  const snapshot = await db.collection("doctors").get();
  const total = snapshot.size;
  const pages = Math.ceil(total / 50000);
  return Array.from({ length: pages }, (_, i) => ({ id: i + 1 }));
}

// Return the actual URLs for each sitemap (static + doctors)
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticUrls: MetadataRoute.Sitemap = [
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
    // Add more static pages here
  ];

  // Doctor pages for this shard
  const offset = (id - 1) * 50000;
  const snap = await db
    .collection("doctors")
    .orderBy("slug")
    .offset(offset)
    .limit(50000)
    .get();

  const doctorUrls = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      url: `${SITE_URL}/doctors/${data.slug}`,
      lastModified: doc.updateTime?.toDate() ?? new Date(),
    };
  });

  // Combine static and first page of doctors
  if (id === 1) {
    return [...staticUrls, ...doctorUrls];
  }
  // Only doctors for subsequent pages
  return doctorUrls;
}

// Revalidate sitemap once per day
export const revalidate = 86400;
