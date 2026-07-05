import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Shred kişisel veri gizlilik politikası ve çerez kullanımı.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Gizlilik Politikası" lastUpdated="22 Mayıs 2026">
      <h2>1. Genel Bakış</h2>
      <p>
        Shred olarak gizliliğinize değer veriyoruz. Bu politika, hangi
        verileri topladığımızı, neden topladığımızı, nasıl koruduğumuzu ve
        haklarınızı açıklar. KVKK kapsamındaki ayrıntılı aydınlatma metnimiz
        için ayrıca <strong>/kvkk</strong> sayfasını inceleyebilirsiniz.
      </p>

      <h2>2. Topladığımız Veriler</h2>
      <ul>
        <li>
          <strong>Hesap bilgileri:</strong> Ad-soyad, e-posta, şifre (hash'li),
          telefon (opsiyonel)
        </li>
        <li>
          <strong>İçerik:</strong> Yüklediğiniz programlar, beslenme planları,
          fotoğraflar, öğrenci notları
        </li>
        <li>
          <strong>Ödeme:</strong> Tam kart bilgisi tarafımızda saklanmaz —
          ödeme sağlayıcılarımız işler. Sadece fatura adına dair bilgileri
          saklarız.
        </li>
        <li>
          <strong>Kullanım verisi:</strong> IP, tarayıcı, oturum süreleri,
          tıklama yolları (yalnızca analitik onayınız varsa)
        </li>
        <li>
          <strong>Çerezler:</strong> Aşağıda detaylı.
        </li>
      </ul>

      <h2>3. Çerezler</h2>
      <h3>Zorunlu Çerezler</h3>
      <p>
        Oturum açma ve güvenlik için gereklidir; reddedemezsiniz çünkü site
        çalışmaz.
      </p>
      <h3>Analitik Çerezler (opsiyonel)</h3>
      <p>
        Google Analytics 4 kullanırız. Sadece açık onayınız ile yüklenir.
        Onayınızı dilediğiniz zaman geri çekebilirsiniz.
      </p>
      <h3>Pazarlama Çerezleri</h3>
      <p>Şu an aktif kullanmıyoruz.</p>

      <h2>4. Verilerinizi Nasıl Kullanırız</h2>
      <ul>
        <li>Hizmeti sağlamak ve geliştirmek</li>
        <li>Faturalandırma ve ödeme tahsilatı</li>
        <li>
          Önemli hizmet bildirimleri (güvenlik, paket sonu, vb.) — bu
          e-postaları kapatamazsınız
        </li>
        <li>İsteğe bağlı pazarlama e-postaları (açıkça onay verdiyseniz)</li>
        <li>Güvenlik olaylarını araştırma ve yasal yükümlülüklere uyum</li>
      </ul>

      <h2>5. Üçüncü Taraf Servisler</h2>
      <ul>
        <li>
          <strong>Supabase</strong> (Avrupa bölgesi) — auth + veritabanı
        </li>
        <li>
          <strong>Vercel</strong> — uygulama hosting
        </li>
        <li>
          <strong>iyzico / Stripe</strong> — ödeme işleme
        </li>
        <li>
          <strong>Resend</strong> — e-posta gönderimi
        </li>
        <li>
          <strong>Google Analytics</strong> (opsiyonel) — ziyaretçi analitiği
        </li>
        <li>
          <strong>Sentry</strong> (opsiyonel) — hata izleme
        </li>
      </ul>

      <h2>6. Güvenlik Önlemleri</h2>
      <ul>
        <li>HTTPS ile şifreli iletişim</li>
        <li>Şifreler bcrypt/argon ile hash'lenir</li>
        <li>Rol bazlı erişim kontrolü (RBAC) ve Supabase RLS</li>
        <li>Düzenli güvenlik gözden geçirmeleri</li>
      </ul>

      <h2>7. Verilerinizi Saklama Süresi</h2>
      <p>
        Hesabınız aktifken verileriniz tutulur. Hesap kapatıldıktan sonra
        yasal yükümlülüklere tabi olmayan veriler 30 gün içinde
        silinir/anonimleştirilir. Fatura/mali kayıtlar yasal saklama
        süresince (genelde 10 yıl) tutulur.
      </p>

      <h2>8. Çocukların Gizliliği</h2>
      <p>
        Hizmetimiz 18 yaş altı kullanıcılara yönelik değildir. Bilerek
        çocuklardan veri toplamayız.
      </p>

      <h2>9. Politika Değişiklikleri</h2>
      <p>
        Bu politikayı güncellediğimizde tarih değişir ve önemli
        değişiklikler için e-posta veya panel içi bildirim gönderilir.
      </p>

      <h2>10. İletişim</h2>
      <p>
        Sorularınız için: <strong>destek@shred.com.tr</strong>
      </p>
    </LegalPageShell>
  );
}
