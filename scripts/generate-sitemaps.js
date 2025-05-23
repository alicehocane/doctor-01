// scripts/generate-sitemaps.js
import fs from 'fs'
import path from 'path'
import admin from 'firebase-admin'

// 1. Init Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}
const db = admin.firestore()

// 2. Fetch all doctors and chunk into pages
async function buildDoctorSitemaps() {
  const allDocs = []
  const snap = await db.collection('doctors').orderBy('slug').get()
  snap.docs.forEach(d => {
    allDocs.push({
      slug: d.data().slug,
      lastmod: d.updateTime.toDate().toISOString(),
    })
  })

  const pageSize = 400
  const pages = Math.ceil(allDocs.length / pageSize)
  const outDir = path.resolve(process.cwd(), 'public', 'sitemap.doctors')
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })

  // Generate each page
  for (let i = 0; i < pages; i++) {
    const slice = allDocs.slice(i * pageSize, (i + 1) * pageSize)
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...slice.map(
        d => `
  <url>
    <loc>https://yourdomain.com/doctors/${d.slug}</loc>
    <lastmod>${d.lastmod}</lastmod>
  </url>`
      ),
      '</urlset>',
    ].join('\n')

    fs.writeFileSync(path.join(outDir, `${i+1}.xml`), xml)
  }

  // Generate the index
  const indexXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from({ length: pages }, (_, i) => `
  <sitemap>
    <loc>https://yourdomain.com/sitemap.doctors/${i+1}.xml</loc>
  </sitemap>`),
    '</sitemapindex>',
  ].join('\n')
  fs.writeFileSync(path.resolve(process.cwd(), 'public', 'sitemap.doctors.xml'), indexXml)
}

;(async () => {
  await buildDoctorSitemaps()
  console.log('✅ doctor sitemaps generated.')
})()
