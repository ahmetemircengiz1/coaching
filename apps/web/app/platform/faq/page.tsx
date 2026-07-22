import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Shred hakkında sıkça sorulan sorular ve cevaplar.",
};

export default function FaqPage() {
  return (
    <LegalPageShell title="Sıkça Sorulan Sorular" lastUpdated="22 Temmuz 2026">
      <h2>Shred nedir?</h2>
      <p>
        Shred, fitness koçlarının kendi markaları altında web sitesi, koç paneli
        ve öğrenci paneli sahibi olmasını sağlayan bir platformdur. Program ve
        beslenme planı hazırlama, öğrenci takibi, check-in ve ilerleme
        grafikleri tek panelde toplanır; siten dakikalar içinde yayına girer.
      </p>

      <h2>Nasıl başlarım?</h2>
      <p>
        E-postanla ücretsiz kaydolur, marka adını ve site adresini seçersin.
        Siten anında <em>koçadı.shred.com.tr</em> adresinde yayına alınır;
        ardından şablonunu, renklerini ve içeriklerini panelden dilediğin gibi
        düzenlersin.
      </p>

      <h2>Ücretlendirme nasıl işliyor?</h2>
      <p>
        Şu an tüm özellikler herkese açık ve ücretsizdir. İleride premium
        planlar eklenecek; bugün ücretsiz kullandığın özellikler için geriye
        dönük bir ücret talep edilmeyecek ve fiyatlandırma değişiklikleri
        önceden duyurulacaktır.
      </p>

      <h2>Öğrencilerimden ödemeyi nasıl alırım?</h2>
      <p>
        Paket fiyatlarını sen belirlersin ve ödemeyi doğrudan kendi yöntemlerinle
        (havale, IBAN vb.) alırsın. Shred ödemeye aracılık etmez ve kazancından
        komisyon almaz; ücretin tamamı sende kalır.
      </p>

      <h2>Öğrencilerim nasıl kayıt olur?</h2>
      <p>
        Panelinden tek tıkla kayıt kodu üretir, öğrencine iletirsin. Öğrencin bu
        kodla senin siten üzerinden kayıt olur; kod istersen belirli bir pakete
        bağlanabilir, süreli olabilir ve tek kullanımlıktır. Kimin kayıt
        olacağının kontrolü tamamen sendedir.
      </p>

      <h2>Kendi alan adımı kullanabilir miyim?</h2>
      <p>
        Evet. Siten önce <em>koçadı.shred.com.tr</em> alt alan adında yayına
        girer; istediğin zaman kendi alan adını (örn. seninmarkan.com)
        bağlayarak tamamen kendi markanla devam edebilirsin.
      </p>

      <h2>Sitemin tasarımını değiştirebilir miyim?</h2>
      <p>
        İstediğin an. Hazır şablonlar arasında geçiş yapabilir, bölümleri açıp
        kapatabilir; metin, fotoğraf ve renkleri site kurucudan saniyeler içinde
        güncelleyebilirsin. Değişiklikler anında yayına yansır.
      </p>

      <h2>Verilerim güvende mi?</h2>
      <p>
        Veriler Avrupa bölgesindeki sunucularda, HTTPS ve rol bazlı erişimle
        korunur. Her koçun verisi diğerlerinden izole tutulur; öğrenci
        fotoğrafları gizli depolamada saklanır ve yalnızca yetkili kişiler
        erişebilir. Detay için <strong>/privacy</strong> ve{" "}
        <strong>/kvkk</strong> sayfalarına bakabilirsin.
      </p>

      <h2>Hesabımı nasıl kapatırım?</h2>
      <p>
        Panel &rsaquo; Ayarlar &rsaquo; Hesap bölümünden hesabını istediğin an
        kalıcı olarak kapatabilirsin. Bu işlemle siten, öğrenci kayıtların ve
        yüklediğin tüm dosyalar geri alınamaz şekilde silinir.
      </p>

      <h2>Destekle nasıl iletişime geçebilirim?</h2>
      <p>
        <strong>destek@shred.com.tr</strong> adresine yazabilirsin. Mesai
        saatleri içinde genellikle aynı gün, en geç 24 saat içinde yanıt
        veriyoruz.
      </p>
    </LegalPageShell>
  );
}
