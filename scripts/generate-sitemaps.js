// scripts/generate-sitemaps.js
import fs from 'fs'
import path from 'path'
import admin from 'firebase-admin'

// ---------- CONFIG ----------
const PAGE_SIZE = 400
const SITE_URL = process.env.SITE_URL || 'https://yourdomain.com'
const publicDir = path.resolve(process.cwd(), 'public')
const doctorsDir = path.join(publicDir, 'sitemap.doctors')
const metaFile = path.join(publicDir, 'sitemap.doctors.meta.json')

// ---------- INIT FIREBASE ----------
if (!admin.apps.length) {
  const serviceAccount = {
    project_id:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}
const db = admin.firestore()

// ---------- LOAD META ----------
let meta: { lastTimestamp?: string } = {}
if (fs.existsSync(metaFile)) {
  try {
    meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
  } catch {}
}

// ---------- FETCH NEW OR ALL DOCTORS ----------
async function fetchDocs() {
  let q = db.collection('doctors').orderBy('createdAt')
  if (meta.lastTimestamp) {
    q = q.where('createdAt', '>', new Date(meta.lastTimestamp))
  }
  const snapshot = await q.get()
  return snapshot.docs.map(d => ({
    slug: d.data().slug,
    lastmod: d.updateTime.toDate().toISOString(),
    createdAt: d.data().createdAt.toDate().toISOString(),
  }))
}

// ---------- WRITE A PAGE ----------
function writePage(pageIndex: number, docs: Array<{slug: string,lastmod: string}>) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...docs.map(d =>
      `  <url>\n    <loc>${SITE_URL}/doctors/${d.slug}</loc>\n    <lastmod>${d.lastmod}</lastmod>\n  </url>`
    ),
    '</urlset>'
  ].join('\n')
  fs.writeFileSync(path.join(doctorsDir, `${pageIndex}.xml`), xml)
}

// ---------- MAIN ----------
;(async () => {
  console.log('🔄 Checking for new doctors since', meta.lastTimestamp || 'start')
  const newDocs = await fetchDocs()
  if (newDocs.length === 0) {
    console.log('✅ No new doctors, skipping sitemap generation.')
    return
  }

  // Read existing docs (if any)
  let allDocs: Array<{slug:string,lastmod:string}> = []
  if (fs.existsSync(doctorsDir)) {
    const files = fs.readdirSync(doctorsDir).
      filter(f => f.endsWith('.xml')).
      sort((a,b) => parseInt(a) - parseInt(b))
    for (const file of files) {
      const content = fs.readFileSync(path.join(doctorsDir,file), 'utf-8')
      const matches = [...content.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
      matches.forEach(m => {
        const loc = m[1]
        const slug = loc.split('/').pop()!
        const lastmod = m[2]
        allDocs.push({ slug, lastmod })
      })
    }
  }

  // Append new docs
  allDocs = allDocs.concat(newDocs.map(d => ({ slug: d.slug, lastmod: d.lastmod })))

  // Ensure output dirs exist
  fs.rmSync(doctorsDir, { recursive: true, force: true })
  fs.mkdirSync(doctorsDir, { recursive: true })

  // Chunk into pages and write
  const pages = Math.ceil(allDocs.length / PAGE_SIZE)
  for (let i = 0; i < pages; i++) {
    const chunk = allDocs.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE)
    writePage(i + 1, chunk)
  }

  // Write index
  const indexXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from({ length: pages }, (_, i) =>
      `  <sitemap>\n    <loc>${SITE_URL}/sitemap.doctors/${i+1}.xml</loc>\n  </sitemap>`
    ),
    '</sitemapindex>'
  ].join('\n')
  fs.writeFileSync(path.join(publicDir, 'sitemap.doctors.xml'), indexXml)

  // Update meta
  fs.writeFileSync(metaFile, JSON.stringify({
    lastTimestamp: new Date().toISOString()
  }, null, 2))

  console.log('✅ Doctor sitemaps updated:', pages, 'pages.')
})().catch(err => {
  console.error(err)
  process.exit(1)
})
