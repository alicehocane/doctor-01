// scripts/generate-sitemaps.js
// Converted to CommonJS to avoid ESM warnings
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// ---------- CONFIG ----------
const PAGE_SIZE = 400;
const SITE_URL = process.env.SITE_URL || 'https://doctor-01.vercel.app';
const publicDir = path.resolve(process.cwd(), 'public');
const doctorsDir = path.join(publicDir, 'sitemap.doctors');
const metaFile = path.join(publicDir, 'sitemap.doctors.meta.json');

// Define your static pages here
const staticPages = [
  { path: '/',        freq: 'daily',   pri: '1.0' },
  { path: '/about',   freq: 'monthly', pri: '0.7' },
  { path: '/contact', freq: 'monthly', pri: '0.7' },
  // add more as needed
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

// ---------- LOAD META ----------
let meta = {};
if (fs.existsSync(metaFile)) {
  try {
    meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
  } catch (e) {
    console.warn('Failed to parse meta file:', e);
  }
}

// ---------- FETCH NEW OR ALL DOCTORS ----------
async function fetchDocs() {
  let query = db.collection('doctors').orderBy('createdAt');
  if (meta.lastTimestamp) {
    query = query.where('createdAt', '>', new Date(meta.lastTimestamp));
  }
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({
    slug:    doc.data().slug,
    lastmod: doc.updateTime.toDate().toISOString(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  }));
}

// ---------- WRITE DOCTOR PAGE ----------
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

// ---------- WRITE STATIC SITEMAP ----------
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

// ---------- WRITE DOCTORS INDEX ----------
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

// ---------- WRITE MAIN SITEMAP ----------
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

// ---------- MAIN ----------
(async () => {
  // Guard: skip if no meta file (CI/build)
  if (!fs.existsSync(metaFile)) {
    console.log('⚠️  No meta file found. Skipping sitemap generation to avoid Firestore calls.');
    console.log('    Please run this script locally once to seed the initial sitemaps:');
    console.log('      node scripts/generate-sitemaps.js');
    return;
  }

  // Prepare output folders
  fs.rmSync(doctorsDir, { recursive: true, force: true });
  fs.mkdirSync(doctorsDir, { recursive: true });

  // Fetch doctor records (new or all)
  const newDocs = await fetchDocs();
  console.log(`🔍 Fetched ${newDocs.length} doctor records.`);

  // Load existing records if meta exists
  let allDocs = [];
  if (fs.existsSync(doctorsDir)) {
    const files = fs.readdirSync(doctorsDir).filter(f => f.endsWith('.xml')).sort();
    files.forEach(file => {
      const content = fs.readFileSync(path.join(doctorsDir, file), 'utf-8');
      const regex = /<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
      let m;
      while ((m = regex.exec(content))) {
        const slug = m[1].split('/').pop();
        allDocs.push({ slug, lastmod: m[2] });
      }
    });
  }

  // Combine and chunk
  newDocs.forEach(d => allDocs.push({ slug: d.slug, lastmod: d.lastmod }));
  const pages = Math.ceil(allDocs.length / PAGE_SIZE);
  for (let i = 0; i < pages; i++) {
    writeDoctorPage(i+1, allDocs.slice(i*PAGE_SIZE, (i+1)*PAGE_SIZE));
  }

  // Generate sitemaps
  writeDoctorsIndex(pages);
  writeStaticSitemap();
  writeMainSitemap();

  // Update meta timestamp
  fs.writeFileSync(metaFile, JSON.stringify({ lastTimestamp: new Date().toISOString() }, null, 2));
  console.log(`✅ Sitemaps generated: static, ${pages} doctor pages, master index.`);
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
