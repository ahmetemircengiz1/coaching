# Salon Tarama & Mail Ajanı

Google Places API ile spor salonlarını bulur, web sitelerinden e-posta adreslerini çıkarır,
kişiselleştirilmiş tanıtım mailini kontrollü şekilde (günlük limit + rastgele bekleme) gönderir.

## Kurulum (bir kez)

1. **Google Places API anahtarı**
   - [console.cloud.google.com](https://console.cloud.google.com) → yeni proje → "Places API (New)" etkinleştir → API anahtarı oluştur.
   - Faturalandırma istenir (kart eklenir) ama aylık ücretsiz kota bizim hacmimizin çok üstünde — birkaç yüz arama ücret çıkarmaz.
2. **Gmail uygulama şifresi** (mail göndermek için)
   - Google Hesabı → Güvenlik → 2 Adımlı Doğrulama açık olmalı → "Uygulama şifreleri" → yeni şifre oluştur.
   - (Opsiyonel ama önerilir: ImprovMX + Gmail "şu adresten gönder" ayarıyla `ahmet@shred.com.tr` görünümü.)
3. Bu klasörde: `.env.example` dosyasını `.env` olarak kopyala ve doldur, sonra `npm install`.

## Kullanım

```
node 1-fetch-places.cjs        # queries.txt'teki her arama için salonları çeker -> out/places.json
node 2-find-emails.cjs         # web sitelerini tarar, e-posta bulur -> out/leads.json + leads.csv
node 3-send.cjs --dry-run      # gönderilecek mailleri EKRANA yazar (gönderMEZ) — önce bunu çalıştır
node 3-send.cjs --send --limit 20   # gerçek gönderim (varsayılan limit 20/gün)
```

- `queries.txt`: her satır bir arama ("spor salonu Kadıköy" gibi). İlçe ilçe ilerle.
- E-postası bulunamayan salonlar `out/no-email.csv`'ye düşer — bunları telefon/WhatsApp ile ara.
- `out/sent-log.json` gönderilenleri tutar; aynı adrese ikinci kez mail GİTMEZ.
- Mail şablonu `3-send.cjs` içinde `buildEmail()` fonksiyonunda — konu ve metni oradan düzenle.

## Kurallar (spam'e düşmemek + yasal uyum)

- Günde 20-30 mailden fazla gönderme (yeni adres için ilk hafta 10-15).
- Şablondaki çıkış (listeden çıkma) satırını SİLME — 6563 sayılı kanun ticari iletide çıkış imkânı ister
  (işletmelere/tacirlere ön onay istisnası vardır ama çıkış hakkı kalır).
- Cevap "istemiyorum" ise adresi `out/optout.txt`'e ekle (her satıra bir adres) — script o listeye göndermez.
- Takip maili: 4-5 gün cevap yoksa aynı kişiye elle kısa bir hatırlatma yaz (otomatikleştirme, kişisel kalsın).
