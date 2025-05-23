// FILE: app/sitemap.xml/route.ts
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.SitemapIndex {
  const baseUrl = "https://doctor-01.vercel.app"
  return [
    {
      url: `${baseUrl}/sitemap.static.xml`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/sitemap.doctors.xml`,
      lastModified: new Date().toISOString(),
    },
  ]
}
