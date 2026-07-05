import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Shred hakkında sıkça sorulan sorular ve cevaplar.",
};

export default function FaqPage() {
  return (
    <LegalPageShell title="Sıkça Sorulan Sorular" lastUpdated="22 Mayıs 2026">
      <h2>Shred nedir?</h2>
      <p>
        Shred, fitness ve yaşam koçlarının kendi öğrencilerini, programlarını
        ve beslenmesini yönetebileceği, dakikalar içinde kişisel marka altında
        site/dashboard alabilen bir SaaS platformudur.
      </p>

      <h2>Nasıl başlarım?</h2>
      <p>
        Bir paket seçin, kayıt formu ile e-posta ve marka bilgilerinizi
        girin, ödeme adımını tamamlayın. Hesabınız ve marka siteniz
        otomatik olarak hazırlanır; ilk öğrencinizi davet edebilirsiniz.
      </p>

      <h2>Kendi alan adımı kullanabilir miyim?</h2>
      <p>
        Evet. Standart paketlerle <em>markanız.shred.com.tr</em> tarzı
        bir alt alan adı kullanırsınız. Üst paketlerde kendi
        özel alan adınızı (örn. mertkoclukbestmkocluk.com) bağlayabilirsiniz.
      </p>

      <h2>Öğrencilerimden ücret tahsil edebilir miyim?</h2>
      <p>
        Evet. Paket fiyatlarını siz belirlersiniz, öğrenciler size doğrudan
        ödeme yapar. Şu an entegrasyon iyzico/Stripe üzerinden
        gerçekleştirilir; ödemeler doğrudan banka hesabınıza geçer.
      </p>

      <h2>Beta sürecinde ücretsiz mi?</h2>
      <p>
        İlk lansman döneminde &ldquo;kurucu&rdquo; koçlarımıza ücretsiz
        erişim sağlanmaktadır. Beta sonrası kalıcı ücretler için
        <strong> /platform/pricing</strong> sayfasını izleyin; kurucu
        koçlarımıza kalıcı indirimli fiyat sunulacaktır.
      </p>

      <h2>Verilerim güvende mi?</h2>
      <p>
        Veriler Avrupa bölgesindeki Supabase üzerinde, HTTPS ve rol bazlı
        erişimle korunur. Detay için
        <strong> /privacy</strong> ve <strong>/kvkk</strong> sayfalarına
        bakabilirsiniz.
      </p>

      <h2>Programlarımı dışarı aktarabilir miyim?</h2>
      <p>
        Evet. Her program ve beslenme planı CSV/JSON formatında dışa
        aktarılabilir. Hesabınızı kapatmadan önce verilerinizi
        indirebilirsiniz.
      </p>

      <h2>Aboneliği nasıl iptal ederim?</h2>
      <p>
        Dashboard &rsaquo; Ayarlar &rsaquo; Hesap menüsünden iptal
        edebilirsiniz. İptal sonrası dönem sonuna kadar hizmete erişim
        devam eder.
      </p>

      <h2>Destekle nasıl iletişime geçebilirim?</h2>
      <p>
        <strong>destek@shred.com.tr</strong> adresine yazabilir veya
        dashboard içindeki destek butonundan ulaşabilirsiniz. Mesai saatleri
        dahilinde 24 saat içinde yanıt veriyoruz.
      </p>

      <h2>Geri ödeme politikası nedir?</h2>
      <p>
        Aboneliğinizi başlattıktan sonra hizmet aktif olarak kullanıldıysa
        dönem ortası iadeleri yapılmaz. Beklenmedik kesinti veya kullanım
        engelinde iyi niyet çerçevesinde değerlendirilir.
      </p>
    </LegalPageShell>
  );
}
