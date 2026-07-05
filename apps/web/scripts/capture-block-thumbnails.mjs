#!/usr/bin/env node
/**
 * Section Builder block thumbnail capture script.
 *
 * Önkoşullar:
 *   1. Dev server koşmalı (pnpm dev — varsayılan http://localhost:3002)
 *   2. puppeteer-core kurulmalı (pnpm add -D -w puppeteer-core)
 *   3. Sistem Chrome/Edge yüklü olmalı (Windows: Chrome veya Edge default path'lerde aranır)
 *
 * Kullanım:
 *   node apps/web/scripts/capture-block-thumbnails.mjs
 *   node apps/web/scripts/capture-block-thumbnails.mjs --base http://localhost:3002 --only hero
 *   node apps/web/scripts/capture-block-thumbnails.mjs --chrome "C:/Program Files/Google/Chrome/Application/chrome.exe"
 *
 * Çıktı: apps/web/public/blocks/{blockId}.png
 */

import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Args
const args = process.argv.slice(2);
const argMap = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("--") && args[i + 1] && !args[i + 1].startsWith("--")) {
    argMap[a.slice(2)] = args[++i];
  } else if (a.startsWith("--")) {
    argMap[a.slice(2)] = true;
  }
}

const BASE_URL = argMap.base || "http://localhost:3002";
const ONLY_CATEGORY = argMap.only || null;
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;
const THUMB_WIDTH = 640;
const THUMB_HEIGHT = 400;
const OUT_DIR = resolve(__dirname, "../public/blocks");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Sistem Chrome path bulma
function findChromePath() {
  if (argMap.chrome) return argMap.chrome;
  const candidates = process.platform === "win32"
    ? [
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
        "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
        "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
        "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
      ]
    : process.platform === "darwin"
    ? [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      ]
    : [
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/usr/bin/microsoft-edge",
      ];
  for (const c of candidates) {
    if (c && existsSync(c)) return c;
  }
  return null;
}

// Manifest'i build edilmiş JSON'dan oku — script TypeScript import edemez. Onun yerine
// dev server'a request atıp /dev/manifest endpoint'inden çekelim ya da hardcode liste.
// Pratik yaklaşım: manifest-meta'yı runtime'da fetch et.
async function loadBlockList() {
  const res = await fetch(`${BASE_URL}/api/dev/block-list`);
  if (!res.ok) {
    throw new Error(`Block list endpoint cevap vermedi (${res.status}). /api/dev/block-list rotasının canlı olduğundan emin ol.`);
  }
  const data = await res.json();
  return data.blocks;
}

async function main() {
  const chromePath = findChromePath();
  if (!chromePath) {
    console.error("❌ Sistem Chrome/Edge bulunamadı. --chrome flag'i ile path ver.");
    process.exit(1);
  }
  console.log(`🌐 Chrome: ${chromePath}`);
  console.log(`🔗 Base URL: ${BASE_URL}`);

  let puppeteer;
  try {
    puppeteer = (await import("puppeteer-core")).default;
  } catch {
    console.error("❌ puppeteer-core kurulu değil. Çalıştır: pnpm add -D -w puppeteer-core");
    process.exit(1);
  }

  const blocks = await loadBlockList();
  const filtered = ONLY_CATEGORY
    ? blocks.filter((b) => b.category === ONLY_CATEGORY)
    : blocks;

  console.log(`📸 ${filtered.length} blok yakalanıyor...`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    defaultViewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT, deviceScaleFactor: 1 },
  });

  let success = 0;
  let failed = 0;

  for (const block of filtered) {
    const url = `${BASE_URL}/dev/block-preview/${block.id}`;
    const out = resolve(OUT_DIR, `${block.id}.png`);
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      // Animasyonların oturmasını bekle
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({
        path: out,
        clip: { x: 0, y: 0, width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
        type: "png",
      });
      await page.close();
      console.log(`  ✓ ${block.id}`);
      success++;
    } catch (err) {
      console.warn(`  ✗ ${block.id}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  console.log(`\n🎉 Bitti — ${success} başarılı, ${failed} başarısız`);
  console.log(`Çıktı: ${OUT_DIR}`);
  console.log(`Not: PNG'ler 1280x800. İstersen sharp ile küçült:`);
  console.log(`  pnpm dlx sharp-cli resize ${THUMB_WIDTH} ${THUMB_HEIGHT} --input "${OUT_DIR}/*.png" --output "${OUT_DIR}/"`);
}

main().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
