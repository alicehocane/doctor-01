// pages/api/sitemap.xml.ts
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://yourdomain.com/sitemap.static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://yourdomain.com/sitemap.doctors.xml</loc>
  </sitemap>
</sitemapindex>`

  res.setHeader("Content-Type", "application/xml")
  res.write(xml)
  res.end()
}
