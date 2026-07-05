// FAQ blokları için ortak veri çözümleyici.
// Coach kendi SSS'ini kaydettiyse onu kullan; yoksa sane Türkçe varsayılanlar.
import type { LandingThemeContent } from "../../types";

export interface BlockFaq {
  q: string;
  a: string;
}

export const DEFAULT_BLOCK_FAQS: BlockFaq[] = [
  {
    q: "Programa nasıl başlarım?",
    a: "Size uygun paketi seçtikten sonra kayıt formunu doldurmanız yeterli. Koçunuz en kısa sürede sizinle iletişime geçecek ve kişisel programınızı hazırlayacaktır.",
  },
  {
    q: "Ne kadar sürede sonuç alırım?",
    a: "Disiplininize bağlı olarak ilk 4-6 hafta içinde gözle görülür bir değişim hissedeceksiniz.",
  },
  {
    q: "Program sadece profesyonellere mi yönelik?",
    a: "Hayır, algoritmamız tamamen sizin fitness seviyenize göre hesaplanır. Sıfırdan başlayanlar da sisteme dahildir.",
  },
  {
    q: "Haftalık check-in nedir?",
    a: "Sistem üzerinden pazar günleri ölçülerinizi ve ağırlığınızı girersiniz. Koçunuz bunu inceler ve programınızı gerekirse revize eder.",
  },
  {
    q: "Spor salonuna gitmek zorunlu mu?",
    a: "Programda ekipmanınıza (vücut ağırlığı, dambıl veya gym) göre alternatif opsiyonlar zaten bulunur.",
  },
  {
    q: "Aboneliği nasıl iptal ederim?",
    a: "Gösterge panelinizden 'Aboneliği Yönet' diyerek tek tuşla dondurabilir veya iptal edebilirsiniz.",
  },
];

/** Block'lara veri sağlamak için kullan: koç verisi varsa onu, yoksa default'u döner. */
export function resolveFaqs(content: LandingThemeContent): BlockFaq[] {
  const items = content.faqs;
  if (!items || items.length === 0) return DEFAULT_BLOCK_FAQS;
  return items.map((it) => ({ q: it.question, a: it.answer }));
}
