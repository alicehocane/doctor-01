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
let meta = { lastCount: 0, lastTimestamp: null }
if (fs.existsSync(metaFile)) {
  try {
    meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
  } catch {}
}

// ---------- COUNT DOCTORS ----------
async function getCount() {
  const snap = await db.collection('doctors').count().get()
  return snap.data().count || 0
}

// ---------- FETCH NEW DOCTORS ----------
async function fetchNewDocs(lastTs) {
  let q = db.collection('doctors').orderBy('createdAt')
  if (lastTs) {
    q = q.where('createdAt', '>', new Date(lastTs))
  }
  const snapshot = await q.get()
  return snapshot.docs.map(d => ({
    slug: d.data().slug,
    lastmod: d.updateTime.toDate().toISOString(),
    createdAt: d.data().createdAt.toDate().toISOString(),
  }))
}

// ---------- WRITE A PAGE ----------
function writePage(pageIndex, docs) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...docs.map(d => `  <url>\n    <loc>${SITE_URL}/doctors/${d.slug}</loc>\n    <lastmod>${d.lastmod}</lastmod>\n  </url>`),
    '</urlset>'
  ].join('\n')
  fs.writeFileSync(path.join(doctorsDir, `${pageIndex}.xml`), xml)
}

// ---------- MAIN ----------
;(async () => {
  console.log('🔄 Checking for doctor updates...')
  const total = await getCount()
  const oldCount = meta.lastCount || 0
  if (total === oldCount) {
    console.log('✅ No new doctors, skipping sitemap generation.')
    return
  }

  // Ensure output dirs exist
  fs.rmSync(doctorsDir, { recursive: true, force: true })
  fs.mkdirSync(doctorsDir, { recursive: true })

  // Fetch all docs on first run or only new docs on subsequent runs
  const newDocs = await fetchNewDocs(meta.lastTimestamp)
  console.log(`🔍 Found ${newDocs.length} new doctor(s).`)

  // Combine existing docs metadata if it's first run
  let allDocs = []
  if (oldCount === 0) {
    // first generation: fetch everything
    const snap = await db.collection('doctors').orderBy('createdAt').get()
    snap.docs.forEach(d => {
      allDocs.push({
        slug: d.data().slug,
        lastmod: d.updateTime.toDate().toISOString(),
        createdAt: d.data().createdAt.toDate().toISOString(),
      })
    })
  } else {
    // subsequent: read old pages to gather existing docs
    for (let i = 1; i <= Math.ceil(oldCount / PAGE_SIZE); i++) {
      const file = path.join(doctorsDir, `${i}.xml`)
      if (!fs.existsSync(file)) continue
      const content = fs.readFileSync(file, 'utf-8')
      const matches = [...content.matchAll(/<loc>.+?<\/loc>\s*<lastmod>(.+?)<\/lastmod>/g)]
      matches.forEach(m => {
        const loc = m[0].match(/<loc>(.+?)<\/loc>/)[1]
        const slug = loc.split('/').pop()
        allDocs.push({ slug, lastmod: m[1], createdAt: null })
      })
    }
    // append new docs to end
    allDocs = allDocs.concat(newDocs)
  }

  // Chunk into pages
  const pages = Math.ceil(allDocs.length / PAGE_SIZE)
  for (let i = 0; i < pages; i++) {
    const chunk = allDocs.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE)
    writePage(i + 1, chunk)
  }

  // Write index
  const indexXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from({ length: pages }, (_, i) => `  <sitemap>\n    <loc>${SITE_URL}/sitemap.doctors/${i+1}.xml</loc>\n  </sitemap>`),
    '</sitemapindex>'
  ].join('\n')
  fs.writeFileSync(path.join(publicDir, 'sitemap.doctors.xml'), indexXml)

  // Update meta
  fs.writeFileSync(metaFile, JSON.stringify({
    lastCount: total,
    lastTimestamp: new Date().toISOString()
  }, null, 2))

  console.log('✅ Doctor sitemaps updated.')
})().catch(err => {
  console.error(err)
  process.exit(1)
})
