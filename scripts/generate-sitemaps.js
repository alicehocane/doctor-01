// scripts/generate-sitemaps.js
// CommonJS script to generate sitemaps in /public
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// ---------- CONFIG ----------
const PAGE_SIZE = 400;
const SITE_URL = process.env.SITE_URL || 'https://doctor-01.vercel.app';
const publicDir = path.resolve(process.cwd(), 'public');
const doctorsDir = path.join(publicDir, 'sitemap.doctors');
const metaFile = path.join(publicDir, 'sitemap.doctors.meta.json');
const isCI = !!process.env.CI && !process.env.VERCEL;

// Static pages list
const staticPages = [
  { path: '/',        freq: 'daily',   pri: '1.0' },
  { path: '/about',   freq: 'monthly', pri: '0.7' },
  { path: '/contact', freq: 'monthly', pri: '0.7' },
  // add more static pages here
];

// ---------- INIT FIREBASE ----------
if (!admin.apps.length) {
  const serviceAccount = {
    project_id:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ---------- UTILITY FUNCTIONS ----------
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

function writeDoctorPage(pageIndex, docs) {
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
  fs.writeFileSync(path.join(doctorsDir, `${pageIndex}.xml`), lines.join('\n'));
}

function writeDoctorsIndex(pages) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (let i = 1; i <= pages; i++) {
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

// ---------- FETCH DOCTORS ----------
async function fetchAllDocs() {
  const snap = await db.collection('doctors').orderBy('slug').get();
  return snap.docs.map(d => ({
    slug: d.data().slug,
    lastmod: d.updateTime.toDate().toISOString(),
  }));
}

async function fetchNewDocs(since) {
  let q = db.collection('doctors').orderBy('createdAt');
  if (since) q = q.where('createdAt', '>', new Date(since));
  const snap = await q.get();
  return snap.docs.map(d => ({
    slug: d.data().slug,
    lastmod: d.updateTime.toDate().toISOString(),
  }));
}

// ---------- MAIN ----------
(async () => {
  // Always generate static sitemap
  writeStaticSitemap();

  // Doctors sitemap logic
  let allDocs = [];
  let meta = {};
  if (fs.existsSync(metaFile)) {
    try { meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8')); } catch {};
    allDocs = JSON.parse(
      fs.readFileSync(path.join(publicDir, 'sitemap.doctors.meta.json'), 'utf-8')
    ).docs || [];
  }

  // If not CI or meta exists, fetch docs
  if (!isCI || fs.existsSync(metaFile)) {
    const since = meta.lastTimestamp;
    const newDocs = since ? await fetchNewDocs(since) : await fetchAllDocs();
    console.log(`🔍 Fetched ${newDocs.length} doctor records.`);
    allDocs = allDocs.concat(newDocs);

    // Ensure doctorsDir
    fs.rmSync(doctorsDir, { recursive: true, force: true });
    fs.mkdirSync(doctorsDir, { recursive: true });

    // Chunk and write doctor pages
    const pages = Math.ceil(allDocs.length / PAGE_SIZE);
    for (let i = 0; i < pages; i++) {
      const chunk = allDocs.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
      writeDoctorPage(i + 1, chunk);
    }

    // Write doctors index
    writeDoctorsIndex(Math.ceil(allDocs.length / PAGE_SIZE));

    // Update meta with docs list and timestamp
    fs.writeFileSync(
      metaFile,
      JSON.stringify({ lastTimestamp: new Date().toISOString(), docs: allDocs }, null, 2)
    );
  } else {
    console.log('⚠️  CI build without meta; skipping doctors sitemap generation.');
  }

  // Always generate master sitemap index
  writeMainSitemap();
  console.log('✅ Sitemaps generated.');
})();
