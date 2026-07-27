/**
 * Adım 2: out/places.json'daki web sitelerini gezip e-posta adresi arar.
 * Ana sayfa + yaygın iletişim sayfalarını dener, mailto ve düz metin adresleri toplar.
 *
 * Çıktılar:
 *   out/leads.json + out/leads.csv  -> e-postası bulunanlar (mail ajanının girdisi)
 *   out/no-email.csv                -> e-postası bulunamayanlar (telefonla ara / WhatsApp)
 *
 * Kullanım: node 2-find-emails.cjs
 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "out");
const places = JSON.parse(fs.readFileSync(path.join(OUT, "places.json"), "utf8"));

const CONTACT_PATHS = ["", "/iletisim", "/iletisim/", "/contact", "/contact/", "/iletisim.html", "/bize-ulasin", "/hakkimizda"];
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
// Görsel dosyaları, izleme servisleri, şablon artıkları vb. eleyen kara liste
const JUNK = /\.(png|jpe?g|gif|svg|webp|css|js)$|example\.|sentry|wixpress|@2x|domain\.com|email\.com|yourmail|godaddy|schema\.org/i;

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9",
      },
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (!type.includes("text/html")) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function extractEmails(html) {
  const found = new Set();
  for (const m of html.matchAll(EMAIL_RE)) {
    const email = m[0].toLowerCase().replace(/^mailto:/, "");
    if (!JUNK.test(email) && email.length < 60) found.add(email);
  }
  return [...found];
}

// info@ / iletisim@ gibi kurumsal adresleri öne al
function pickBest(emails) {
  const pref = ["info@", "iletisim@", "contact@", "bilgi@", "destek@"];
  for (const p of pref) {
    const hit = emails.find((e) => e.startsWith(p));
    if (hit) return hit;
  }
  return emails[0];
}

function csvEscape(v) {
  return `"${String(v || "").replace(/"/g, '""')}"`;
}

(async () => {
  const leads = [];
  const noEmail = [];

  for (const p of places) {
    if (!p.website) {
      noEmail.push(p);
      continue;
    }
    let base;
    try {
      base = new URL(p.website).origin;
    } catch {
      noEmail.push(p);
      continue;
    }

    let emails = [];
    for (const cp of CONTACT_PATHS) {
      const html = await fetchText(base + cp);
      if (html) emails.push(...extractEmails(html));
      if (emails.length) break; // ilk bulan sayfa yeter
    }
    emails = [...new Set(emails)];

    if (emails.length) {
      leads.push({ ...p, email: pickBest(emails), allEmails: emails });
      console.log(`✓ ${p.name} -> ${pickBest(emails)}`);
    } else {
      noEmail.push(p);
      console.log(`- ${p.name} (e-posta yok: ${base})`);
    }
    await new Promise((r) => setTimeout(r, 800)); // siteleri yormadan
  }

  fs.writeFileSync(path.join(OUT, "leads.json"), JSON.stringify(leads, null, 2));

  const header = "salon;email;telefon;website;adres\n";
  fs.writeFileSync(
    path.join(OUT, "leads.csv"),
    header + leads.map((l) => [l.name, l.email, l.phone, l.website, l.address].map(csvEscape).join(";")).join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(OUT, "no-email.csv"),
    "salon;telefon;website;adres;maps\n" +
      noEmail.map((l) => [l.name, l.phone, l.website, l.address, l.maps].map(csvEscape).join(";")).join("\n"),
    "utf8"
  );

  console.log(`\n${leads.length} salon e-postalı -> out/leads.json / leads.csv`);
  console.log(`${noEmail.length} salon e-postasız -> out/no-email.csv (telefon/WhatsApp listesi)`);
  console.log("Sıradaki adım: node 3-send.cjs --dry-run");
})();
