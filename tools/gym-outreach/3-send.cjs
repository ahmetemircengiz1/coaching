/**
 * Adım 3: out/leads.json'daki salonlara kişiselleştirilmiş tanıtım maili gönderir.
 *
 *   node 3-send.cjs --dry-run           -> gönderMEZ, mailleri ekrana yazar (önce bunu çalıştır)
 *   node 3-send.cjs --send              -> gönderir (varsayılan limit 20)
 *   node 3-send.cjs --send --limit 10   -> limitli gönderim
 *
 * Güvenlik ağları:
 *   - out/sent-log.json: gönderilen adresler; aynı adrese ikinci kez gitmez.
 *   - out/optout.txt: "istemiyorum" diyenleri her satıra bir adres olacak şekilde ekle; asla gönderilmez.
 *   - Mailler arası 45-120 sn rastgele bekleme (spam filtrelerine takılmamak için).
 */
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const OUT = path.join(__dirname, "out");
const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const SEND = args.includes("--send");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx > -1 ? parseInt(args[limitIdx + 1], 10) || 20 : 20;

if (!DRY && !SEND) {
  console.error("Kullanım: node 3-send.cjs --dry-run  |  node 3-send.cjs --send [--limit 20]");
  process.exit(1);
}

const leads = JSON.parse(fs.readFileSync(path.join(OUT, "leads.json"), "utf8"));

const sentLogPath = path.join(OUT, "sent-log.json");
const sentLog = fs.existsSync(sentLogPath) ? JSON.parse(fs.readFileSync(sentLogPath, "utf8")) : {};

const optoutPath = path.join(OUT, "optout.txt");
const optout = new Set(
  fs.existsSync(optoutPath)
    ? fs.readFileSync(optoutPath, "utf8").split(/\r?\n/).map((s) => s.trim().toLowerCase()).filter(Boolean)
    : []
);

// ---- MAIL ŞABLONU (konu + metni buradan düzenle) ----
function buildEmail(lead) {
  const salon = lead.name;
  return {
    subject: `${salon} eğitmenleri için ücretsiz dijital panel`,
    text: `Merhaba,

Ben Ahmet — Shred'in kurucusuyum (shred.com.tr). ${salon} ekibindeki eğitmenlerin her birine kendi adlarıyla ücretsiz bir koçluk sitesi ve öğrenci takip paneli kuruyoruz: öğrenciler programlarını, beslenmelerini ve ölçümlerini telefondan takip ediyor, eğitmen her şeyi tek panelden yönetiyor.

Şu an lansman dönemindeyiz; kurulum ve kullanım tamamen ücretsiz, komisyon da almıyoruz. Örnek bir koç sitesi: https://hakanyildiz.shred.com.tr

15 dakikalık bir görüşmeyle tüm ekibi kurabilirim. Bu hafta kısa bir telefon görüşmesi için müsait olduğunuz bir gün var mı?

Sevgiler,
Ahmet Emir Cengiz
Shred - shred.com.tr

--
Bu e-postayı işletmenizin herkese açık iletişim adresine gönderdim. Tekrar e-posta almak istemiyorsanız kısaca yanıtlamanız yeterli, listeden çıkarayım.`,
  };
}
// ------------------------------------------------------

const queue = leads.filter((l) => {
  const e = (l.email || "").toLowerCase();
  return e && !sentLog[e] && !optout.has(e);
});

console.log(`${leads.length} lead, ${queue.length} gönderilmemiş; bu çalıştırmada en çok ${LIMIT} mail.\n`);

(async () => {
  let transporter = null;
  if (SEND) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("GMAIL_USER / GMAIL_APP_PASSWORD eksik (.env).");
      process.exit(1);
    }
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transporter.verify();
  }

  let count = 0;
  for (const lead of queue) {
    if (count >= LIMIT) break;
    const { subject, text } = buildEmail(lead);
    const to = lead.email.toLowerCase();

    if (DRY) {
      console.log("=".repeat(60));
      console.log(`KIME : ${lead.name} <${to}>`);
      console.log(`KONU : ${subject}`);
      console.log(text.split("\n").slice(0, 4).join("\n") + "\n...");
    } else {
      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.GMAIL_USER,
          to,
          subject,
          text,
        });
        sentLog[to] = { name: lead.name, at: new Date().toISOString() };
        fs.writeFileSync(sentLogPath, JSON.stringify(sentLog, null, 2));
        console.log(`✓ gönderildi: ${lead.name} <${to}>  (${count + 1}/${LIMIT})`);
      } catch (e) {
        console.error(`✗ HATA ${to}: ${e.message}`);
      }
      // 45-120 sn rastgele bekleme — makine gibi görünmemek için
      const wait = 45000 + Math.floor(Math.random() * 75000);
      await new Promise((r) => setTimeout(r, wait));
    }
    count++;
  }

  console.log(`\n${DRY ? "Önizlenen" : "Gönderilen"}: ${count} mail.`);
  if (DRY) console.log("Gerçek gönderim: node 3-send.cjs --send --limit 20");
})();
