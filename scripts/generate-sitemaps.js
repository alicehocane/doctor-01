// scripts/generate-sitemaps.js
// Optimized static sitemap generator for Vercel deployments

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// ---------- CONFIG ----------
const PAGE_SIZE = 400;
const SITE_URL = process.env.SITE_URL || 'https://yourdomain.com';
const publicDir = path.join(process.cwd(), 'public');
const doctorsDir = path.join(publicDir, 'sitemap.doctors');
const metaFile = path.join(publicDir, 'sitemap.doctors.meta.json');

// Static pages to include
const staticPages = [
  { path: '/',      freq: 'daily',   pri: '1.0' },
  { path: '/about', freq: 'monthly', pri: '0.7' },
  { path: '/contact', freq: 'monthly', pri: '0.7' },
];

// ---------- INIT FIREBASE ----------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
    project_id:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
     client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

// ---------- FIRESTORE FETCHERS ----------
async function fetchAllDocs() {
  const snap = await db.collection('doctors').orderBy('slug').get();
  return snap.docs.map(doc => ({
    slug:    doc.data().slug,
    lastmod: doc.updateTime.toDate().toISOString(),
  }));
}

async function fetchNewDocs(since) {
  let q = db.collection('doctors').orderBy('createdAt');
  if (since) q = q.where('createdAt', '>', new Date(since));
  const snap = await q.get();
  return snap.docs.map(doc => ({
    slug:    doc.data().slug,
    lastmod: doc.updateTime.toDate().toISOString(),
  }));
}

// ---------- XML WRITERS ----------
function writeStaticSitemap() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  staticPages.forEach(p => {
    lines.push(
      `  <url>`,
      `    <loc>${SITE_URL}${p.path}</loc>`,
      `    <lastmod>${new Date().toISOString()}</lastmod>`,
      `    <changefreq>${p.freq}</changefreq>`,
      `    <priority>${p.pri}</priority>`,
      `  </url>`
    );
  });
  lines.push('</urlset>');
  fs.writeFileSync(path.join(publicDir, 'sitemap.static.xml'), lines.join('\n'));
}

function writeDoctorPage(idx, docs) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  docs.forEach(d => {
    lines.push(
      `  <url>`,
      `    <loc>${SITE_URL}/doctors/${d.slug}</loc>`,
      `    <lastmod>${d.lastmod}</lastmod>`,
      `  </url>`
    );
  });
  lines.push('</urlset>');
  fs.writeFileSync(path.join(doctorsDir, `${idx}.xml`), lines.join('\n'));
}

function writeDoctorsIndex(count) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (let i = 1; i <= count; i++) {
    lines.push(
      `  <sitemap>`,
      `    <loc>${SITE_URL}/sitemap.doctors/${i}.xml</loc>`,
      `  </sitemap>`
    );
  }
  lines.push('</sitemapindex>');
  fs.writeFileSync(path.join(publicDir, 'sitemap.doctors.xml'), lines.join('\n'));
}

function writeMainSitemap() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap>`,
    `    <loc>${SITE_URL}/sitemap.static.xml</loc>`,
    `  </sitemap>`,
    `  <sitemap>`,
    `    <loc>${SITE_URL}/sitemap.doctors.xml</loc>`,
    `  </sitemap>`,
    '</sitemapindex>',
  ];
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), lines.join('\n'));
}

// ---------- VERCEL GUARD ----------
if (process.env.VERCEL) {
  console.log('⚠️ Vercel build: only generating static & master sitemaps.');
  // Ensure directories exist
  fs.mkdirSync(doctorsDir, { recursive: true });
  writeStaticSitemap();
  writeMainSitemap();
  process.exit(0);
}

// ---------- FULL GENERATION (LOCAL or CI with meta) ----------
(async () => {
  // Prepare output dirs
  fs.rmSync(doctorsDir, { recursive: true, force: true });
  fs.mkdirSync(doctorsDir, { recursive: true });

  // Static
  writeStaticSitemap();

  // Load meta
  let meta = {};
  if (fs.existsSync(metaFile)) {
    meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8')) || {};
  }

  // Determine fetch type
  const isFirst = !Array.isArray(meta.docs);
  const toFetch = isFirst ? await fetchAllDocs() : await fetchNewDocs(meta.lastTimestamp);
  console.log(`📦 Fetched ${toFetch.length} ${isFirst ? 'total' : 'new'} doctor records.`);

  const all = (isFirst ? [] : meta.docs).concat(toFetch);
  const pages = Math.ceil(all.length / PAGE_SIZE);

  // Write paginated doctor sitemaps
  for (let i = 0; i < pages; i++) {
    writeDoctorPage(i + 1, all.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE));
  }

  // Indexes
  writeDoctorsIndex(pages);
  writeMainSitemap();

  // Persist meta
  fs.writeFileSync(
    metaFile,
    JSON.stringify({ lastTimestamp: new Date().toISOString(), docs: all }, null, 2)
  );

  console.log(`✅ Sitemaps generated: ${pages} doctor pages, static, master index.`);
})();
