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
let meta = {}
if (fs.existsSync(metaFile)) {
  try {
    meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
  } catch {}
}

// ---------- FETCH NEW OR ALL DOCTORS ----------
async function fetchDocs() {
  let query = db.collection('doctors').orderBy('createdAt')
  if (meta.lastTimestamp) {
    query = query.where('createdAt', '>', new Date(meta.lastTimestamp))
  }
  const snapshot = await query.get()
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
    lastmod: doc.updateTime.toDate().toISOString(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  }))
}

// ---------- WRITE A PAGE ----------
function writePage(pageIndex, docs) {
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ]
  docs.forEach(d => {
    xmlLines.push(
      `  <url>`,
      `    <loc>${SITE_URL}/doctors/${d.slug}</loc>`,
      `    <lastmod>${d.lastmod}</lastmod>`,
      `  </url>`
    )
  })
  xmlLines.push('</urlset>')
  const xml = xmlLines.join('\n')
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
  let allDocs = []
  if (fs.existsSync(doctorsDir)) {
    const files = fs.readdirSync(doctorsDir)
      .filter(f => f.endsWith('.xml'))
      .sort((a, b) => Number(a) - Number(b))
    files.forEach(file => {
      const content = fs.readFileSync(path.join(doctorsDir, file), 'utf-8')
      const regex = /<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g
      let match
      while ((match = regex.exec(content))) {
        const loc = match[1]
        const slug = loc.split('/').pop()
        const lastmod = match[2]
        allDocs.push({ slug, lastmod })
      }
    })
  }

  // Append new docs
  newDocs.forEach(d => allDocs.push({ slug: d.slug, lastmod: d.lastmod }))

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
  const indexLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ]
  for (let i = 1; i <= pages; i++) {
    indexLines.push(
      `  <sitemap>`,
      `    <loc>${SITE_URL}/sitemap.doctors/${i}.xml</loc>`,
      `  </sitemap>`
    )
  }
  indexLines.push('</sitemapindex>')
  const indexXml = indexLines.join('\n')
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
