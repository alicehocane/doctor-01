import type { MetadataRoute } from "next"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URLs that are static
  const baseUrls = [
    {
      url: "https://yourdomain.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://yourdomain.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://yourdomain.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://yourdomain.com/buscar",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://yourdomain.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://yourdomain.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]

  // Fetch all doctors to add their URLs to the sitemap
  // try {
  //   const doctorsSnapshot = await getDocs(collection(db, "doctors"))

  //   const doctorUrls = doctorsSnapshot.docs.map((doc) => {
  //     const doctor = doc.data()
  //     return {
  //       url: `https://yourdomain.com/doctor/${doc.id}`,
  //       lastModified: doctor.updatedAt ? new Date(doctor.updatedAt.toDate()) : new Date(),
  //       changeFrequency: "weekly" as const,
  //       priority: 0.7,
  //     }
  //   })

  //   return [...baseUrls, ...doctorUrls]
  // } catch (error) {
  //   console.error("Error generating sitemap:", error)
  //   // Return just the base URLs if there's an error fetching doctors
  //   return baseUrls
  // }
}
