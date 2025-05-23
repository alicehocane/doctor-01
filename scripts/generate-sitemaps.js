// scripts/generate-sitemaps.js
#!/usr/bin/env node

/**
 * Optimized sitemap generator:
 * - Produces /public/sitemap.static.xml, /public/sitemap.doctors/{n}.xml,
 *   /public/sitemap.doctors.xml, and /public/sitemap.xml.
 * - Paginates doctors in 400-URL shards.
 * - On Vercel builds (process.env.VERCEL), skips Firestore reads and uses committed files.
 * - Locally or in CI (without VERCEL), fetches from Firestore in PAGE_SIZE batches.
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// ---------- CONFIG ----------
const PAGE_SIZE = 400;
const SITE_URL = process.env.SITE_URL || 'https://yourdomain.com';
const publicDir = path.join(process.cwd(), 'public');
const doctorsDir = path.join(publicDir, 'sitemap.doctors');
const isVercel = Boolean(process.env.VERCEL);

// ---------- UTILITY: Write XML files ----------
function writeStaticSitemap() {
  const isoNow = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${isoNow}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${isoNow}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${isoNow}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.static.xml'), xml);
}

function writeDoctorPage(pageIndex, docs) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];
  docs.forEach(({ slug, lastmod }) => {
    lines.push(
      '  <url>',
      `    <loc>${SITE_URL}/doctors/${slug}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '  </url>'
    );
  });
  lines.push('</urlset>');
  fs.writeFileSync(path.join(doctorsDir, `${pageIndex}.xml`), lines.join('\n'));
}

function writeDoctorsIndex(pageCount) {
  const isoNow = new Date().toISOString();
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];
  for (let i = 1; i <= pageCount; i++) {
    lines.push(
      '  <sitemap>',
      `    <loc>${SITE_URL}/sitemap.doctors/${i}.xml</loc>`,
      `    <lastmod>${isoNow}</lastmod>`,
      '  </sitemap>'
    );
  }
  lines.push('</sitemapindex>');
  fs.writeFileSync(path.join(publicDir, 'sitemap.doctors.xml'), lines.join('\n'));
}

function writeMainSitemap() {
  const isoNow = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.static.xml</loc>
    <lastmod>${isoNow}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap.doctors.xml</loc>
    <lastmod>${isoNow}</lastmod>
  </sitemap>
</sitemapindex>`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
}

// ---------- FIRESTORE INITIALIZATION ----------
if (!isVercel) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
}

// ---------- MAIN LOGIC ----------
(async () => {
  // Ensure output directories
  fs.mkdirSync(publicDir, { recursive: true });
  fs.rmSync(doctorsDir, { recursive: true, force: true });
  fs.mkdirSync(doctorsDir, { recursive: true });

  // Always write static sitemap
  writeStaticSitemap();

  let totalPages = 0;
  if (!isVercel) {
    // Fetch doctors in PAGE_SIZE batches to limit reads
    const db = admin.firestore();
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
    totalPages = page - 1;
    writeDoctorsIndex(totalPages);
  } else {
    // On Vercel, use pre-committed pages
    if (fs.existsSync(doctorsDir)) {
      totalPages = fs.readdirSync(doctorsDir).filter(f => f.endsWith('.xml')).length;
    }
  }

  // Master index listing only the two sitemaps
  writeMainSitemap();
  console.log(`✅ Sitemaps generated: static + ${totalPages} doctor pages.`);
})();
