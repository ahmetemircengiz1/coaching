/**
 * Adım 1: Google Places API (New) Text Search ile spor salonlarını çeker.
 * queries.txt'teki her satır için arama yapar, tekilleştirip out/places.json'a yazar.
 *
 * Kullanım: node 1-fetch-places.cjs
 */
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const fs = require("fs");
const path = require("path");

const KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!KEY) {
  console.error("GOOGLE_PLACES_API_KEY eksik — .env dosyasını doldur (bkz. README).");
  process.exit(1);
}

const OUT = path.join(__dirname, "out");
fs.mkdirSync(OUT, { recursive: true });

const queries = fs
  .readFileSync(path.join(__dirname, "queries.txt"), "utf8")
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith("#"));

const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.internationalPhoneNumber,places.googleMapsUri,nextPageToken";

const seen = new Map(); // place id -> kayıt (sorgular arası tekilleştirme)

(async () => {
  for (const q of queries) {
    let pageToken = null;
    let page = 0;
    do {
      const body = { textQuery: q, languageCode: "tr", regionCode: "TR" };
      if (pageToken) body.pageToken = pageToken;

      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": KEY,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error(`"${q}" HATA ${res.status}: ${await res.text()}`);
        break;
      }
      const data = await res.json();
      for (const p of data.places || []) {
        if (!seen.has(p.id)) {
          seen.set(p.id, {
            id: p.id,
            name: p.displayName?.text || "",
            address: p.formattedAddress || "",
            website: p.websiteUri || "",
            phone: p.internationalPhoneNumber || "",
            maps: p.googleMapsUri || "",
            query: q,
          });
        }
      }
      pageToken = data.nextPageToken || null;
      page++;
      await new Promise((r) => setTimeout(r, 1200)); // pageToken'ın aktifleşmesi için bekle
    } while (pageToken && page < 3); // sorgu başına en çok ~60 sonuç

    console.log(`"${q}" tamam — toplam ${seen.size} tekil salon`);
  }

  const places = [...seen.values()];
  fs.writeFileSync(path.join(OUT, "places.json"), JSON.stringify(places, null, 2));
  const withSite = places.filter((p) => p.website).length;
  console.log(`\n${places.length} salon bulundu (${withSite} tanesinin web sitesi var) -> out/places.json`);
  console.log("Sıradaki adım: node 2-find-emails.cjs");
})();
