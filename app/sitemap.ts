import type { MetadataRoute } from "next"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrls = [
    {
      url: "https://yourdomain.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: "https://yourdomain.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: "https://yourdomain.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: "https://yourdomain.com/buscar",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: "https://yourdomain.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: "https://yourdomain.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ]

  try {
    const doctorsRef = collection(db, "doctors");
    const doctorsSnapshot = await getDocs(doctorsRef);

    const doctorUrls = doctorsSnapshot.docs.map((doc) => ({
      url: `https://yourdomain.com/doctor/${doc.id}`,
      lastModified: doc.data().updatedAt?.toDate?.() || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...baseUrls, ...doctorUrls];
  } catch (error) {
    console.error("Sitemap error:", error);
    return baseUrls; // Fallback
  }
}