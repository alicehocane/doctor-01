// scripts/generate-sitemaps.js
// Optimized pagination-based sitemap generator for doctors (400 URLs per page)
// Run locally or in CI before deploying to Vercel to seed static files

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// ---------- CONFIG ----------
const PAGE_SIZE = 400;
const SITE_URL = process.env.SITE_URL || 'https://yourdomain.com';
const publicDir = path.join(process.cwd(), 'public');
const doctorsDir = path.join(publicDir, 'sitemap.doctors');

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

// ---------- XML WRITERS ----------
function writeStaticSitemap() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url>`,
    `    <loc>${SITE_URL}/</loc>`,
    `    <lastmod>${new Date().toISOString()}</lastmod>`,
    `    <changefreq>daily</changefreq>`,
    `    <priority>1.0</priority>`,
    `  </url>`,
    `  <url>`,
    `    <loc>${SITE_URL}/about</loc>`,
    `    <lastmod>${new Date().toISOString()}</lastmod>`,
    `    <changefreq>monthly</changefreq>`,
    `    <priority>0.7</priority>`,
    `  </url>`,
    `  <url>`,
    `    <loc>${SITE_URL}/contact</loc>`,
    `    <lastmod>${new Date().toISOString()}</lastmod>`,
    `    <changefreq>monthly</changefreq>`,
    `    <priority>0.7</priority>`,
    `  </url>`,
    '</urlset>',
  ];
  fs.writeFileSync(path.join(publicDir, 'sitemap.static.xml'), lines.join('\n'));
}

function writeMainSitemap(pageCount) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap>`,
    `    <loc>${SITE_URL}/sitemap.static.xml</loc>`,
    `  </sitemap>`,
    `  <sitemap>`,
    `    <loc>${SITE_URL}/sitemap.doctors.xml</loc>`,
    `  </sitemap>`,
  ];
  for (let i = 1; i <= pageCount; i++) {
    lines.push(
      `  <sitemap>`,
      `    <loc>${SITE_URL}/sitemap.doctors/${i}.xml</loc>`,
      `  </sitemap>`
    );
  }
  lines.push('</sitemapindex>');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), lines.join('\n'));
  fs.writeFileSync(path.join(publicDir, 'sitemap.doctors.xml'), lines.slice(0, lines.length-1).join('\n').replace('<sitemapindex','<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex') + '\n</sitemapindex>');
}

function writeDoctorPage(index, docs) {
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
  fs.writeFileSync(path.join(doctorsDir, `${index}.xml`), lines.join('\n'));
}

// ---------- MAIN SCRIPT ----------
(async () => {
  // Ensure output directories
  fs.rmSync(doctorsDir, { recursive: true, force: true });
  fs.mkdirSync(doctorsDir, { recursive: true });

  // Generate static-only sitemap
  writeStaticSitemap();

  // Paginated fetch and write doctors
  let lastDoc = null;
  let page = 1;
  while (true) {
    let query = db.collection('doctors').orderBy('slug').limit(PAGE_SIZE);
    if (lastDoc) query = query.startAfter(lastDoc);

    const snap = await query.get();
    if (snap.empty) break;

    const docs = snap.docs.map(doc => ({
      slug: doc.data().slug,
      lastmod: doc.updateTime.toDate().toISOString(),
    }));

    writeDoctorPage(page, docs);
    lastDoc = snap.docs[snap.docs.length - 1];
    page++;
  }

  // Write master and doctors index sitemaps
  const totalPages = page - 1;
  writeMainSitemap(totalPages);

  console.log(`✅ Generated ${totalPages} doctor sitemap pages (400 each), static & master sitemaps.`);
})();