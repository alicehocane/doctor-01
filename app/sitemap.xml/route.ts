// app/sitemap.xml/route.ts  <-- Main sitemap index
import { MetadataRoute } from "next"

export function GET(): MetadataRoute.SitemapIndex {
  return [
    {
      url: "https://yourdomain.com/sitemap.static.xml",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/sitemap.doctors.xml",
      lastModified: new Date(),
    },
    // Add other sitemap indexes (e.g., posts) as needed
  ]
}