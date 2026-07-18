/**
 * Sayfa rehberi içerikleri — koç ve öğrenci panelindeki her sayfa için
 * "bu sayfada neler yapılır" anlatımı. Dizi sırası aynı zamanda tur sırasıdır.
 */

export interface GuideSection {
  title: string;
  items: string[];
}

export interface GuidePageContent {
  /** Panel köküne göre yol ("" = ana sayfa) */
  href: string;
  label: string;
  intro: string;
  sections: GuideSection[];
}

export const COACH_GUIDE_PAGES: GuidePageContent[] = [
  {
    href: "",
    label: "Ana Sayfa",
    intro:
      "Burası koç panelinin genel bakışı. Öğrencilerinde olan biteni tek ekranda özetler; her kart seni ilgili sayfaya götürür.",
    sections: [
      {
        title: "Bu sayfada ne görürsün",
        items: [
          "Aktif öğrenci sayın, bekleyen check-in'ler ve son aktiviteler özet kartlarda durur.",
          "Bir karta tıkladığında ilgili bölüme (öğrenci detayı, check-in vb.) gidersin.",
          "Soldaki (veya alttaki) menü panelin ana bölümleri arasında gezinmeni sağlar: Öğrenciler, Programlar, Beslenme, Ayarlar.",
          "Menüdeki site ikonuyla kendi landing sayfanı yeni sekmede açıp öğrencilerinin gördüğü hâli kontrol edebilirsin.",
        ],
      },
      {
        title: "İlk kurulumda önerilen sıra",
        items: [
          "1) Ayarlar → site içeriğini düzenle: hero görseli, metinler, iletişim bilgileri.",
          "2) Paketler → koçluk paketlerini ve fiyatlarını belirle (landing sayfanda otomatik görünür).",
          "3) Öğrenciler → pakete bağlı bir kayıt kodu üret ve ilk öğrencini davet et.",
          "4) Programlar ve Beslenme → planlarını hazırla, öğrencine ata.",
        ],
      },
    ],
  },
  {
    href: "/students",
    label: "Öğrenciler",
    intro:
      "Tüm öğrencilerini buradan yönetirsin: davet etme, listeleme, detaylı takip ve geri bildirim.",
    sections: [
      {
        title: "Yeni öğrenci ekleme",
        items: [
          "Kayıt kodu üret: kodu bir pakete bağlarsın; öğrenci bu kodla sitenden kayıt olur, e-postasını doğrular ve otomatik olarak listene düşer.",
          "Kodlar tek kullanımlıktır; istersen etiket verip kimin için ürettiğini not edebilirsin.",
          "Alternatif olarak e-posta davet linki gönderebilirsin — link de tek kullanımlıktır.",
        ],
      },
      {
        title: "Öğrenci listesi",
        items: [
          "Arama kutusuyla isme göre bul; durum ve pakete göre filtrele.",
          "Bir öğrenciye tıklayınca detay sayfası açılır.",
        ],
      },
      {
        title: "Öğrenci detayında neler var",
        items: [
          "Atadığın antrenman programları ve beslenme planları — buradan yeni atama da yapabilirsin.",
          "Haftalık check-in'ler: kilo/ölçümler, fotoğraflar ve öğrencinin notları; her check-in'e geri bildirim yazabilirsin.",
          "İlerleme grafikleri, öğün kayıtları (fotoğraflı) ve kendine özel tuttuğun koç notları.",
        ],
      },
    ],
  },
  {
    href: "/programs",
    label: "Programlar",
    intro:
      "Antrenman programlarını burada oluşturur, düzenler ve öğrencilerine atarsın.",
    sections: [
      {
        title: "Program oluşturma",
        items: [
          "Yeni Program sihirbazıyla başla: hazır şablonlardan birini kopyalayabilir veya sıfırdan kurabilirsin.",
          "Program kurucuda haftanın günlerine antrenman ekler, her antrenmana egzersiz + set × tekrar + dinlenme süresi tanımlarsın.",
          "Bir egzersize alternatif egzersiz belirleyebilirsin — öğrenci ekipman yoksa alternatife geçer.",
        ],
      },
      {
        title: "Atama ve takip",
        items: [
          "Programı bir veya birden fazla öğrenciye aynı anda atayabilirsin.",
          "Öğrenci, panelindeki Antrenman sekmesinde programı görür; setleri tamamladıkça işaretler, ağırlık/tekrar kaydeder.",
          "Bu kayıtlar öğrenci detayındaki ilerleme grafiklerine otomatik işlenir.",
        ],
      },
      {
        title: "Egzersiz kütüphanesi",
        items: [
          "160+ hazır egzersiz kütüphaneden gelir; kendi egzersizlerini video linkiyle Egzersizler sayfasından ekleyebilirsin.",
        ],
      },
    ],
  },
  {
    href: "/exercises",
    label: "Egzersizler",
    intro:
      "Programlarında kullanacağın egzersiz kütüphanesi. Hazır egzersizlerin yanına kendi egzersizlerini ekleyebilirsin.",
    sections: [
      {
        title: "Kütüphane",
        items: [
          "Hazır egzersizler kas grubuna ve ekipmana göre filtrelenebilir.",
          "Her egzersizin açıklaması ve varsa video bağlantısı bulunur.",
        ],
      },
      {
        title: "Özel egzersiz ekleme",
        items: [
          "Ad, kas grubu, açıklama ve video URL'siyle kendi egzersizini oluştur.",
          "Eklediğin egzersizler yalnızca sana görünür ve tüm programlarında kullanılabilir.",
        ],
      },
    ],
  },
  {
    href: "/nutrition",
    label: "Beslenme",
    intro:
      "Beslenme planlarını burada hazırlar, kalori/makro hedefleri belirler ve öğrencilerine atarsın.",
    sections: [
      {
        title: "Plan oluşturma",
        items: [
          "Günlük kalori ve makro (protein/karbonhidrat/yağ) hedeflerini belirle.",
          "Öğünler ekle; hazır besin veritabanından arayarak besinleri gramajıyla öğünlere yerleştir.",
          "İstersen supplement önerileri de ekleyebilirsin.",
        ],
      },
      {
        title: "Atama ve takip",
        items: [
          "Planı öğrenciye ata; öğrenci Beslenme sekmesinde öğünlerini görür ve tamamladıkça işaretler.",
          "Öğrenci fotoğraflı öğün kaydı tutabilir; bu kayıtları öğrenci detayından izler ve geri bildirim verirsin.",
        ],
      },
    ],
  },
  {
    href: "/packages",
    label: "Paketler",
    intro:
      "Sitende sunduğun koçluk paketlerini burada yönetirsin. Aktif paketler landing sayfandaki paket bölümünde otomatik görünür.",
    sections: [
      {
        title: "Paket yönetimi",
        items: [
          "Paket adı, süresi, fiyatı ve özellik listesini belirle; dilediğin zaman düzenle veya pasife al.",
          "Fiyat ve içerik değişikliklerin landing sayfana anında yansır.",
        ],
      },
      {
        title: "Kayıt kodlarıyla bağlantı",
        items: [
          "Öğrenciler için ürettiğin kayıt kodlarını bir pakete bağlarsın; öğrenci o kodla kayıt olunca doğru pakete otomatik yerleşir.",
        ],
      },
    ],
  },
  {
    href: "/transformations",
    label: "Dönüşümler",
    intro:
      "Öğrencilerinin öncesi/sonrası dönüşümlerini burada sergilersin — landing sayfandaki dönüşümler bölümünü besler.",
    sections: [
      {
        title: "Dönüşüm ekleme",
        items: [
          "Öncesi ve sonrası fotoğrafları yükle, isim/etiket ve kısa açıklama ekle.",
          "Eklediğin dönüşümler landing sayfanda otomatik görünür; sıralarını düzenleyebilirsin.",
          "Yalnızca öğrencinden izin aldığın fotoğrafları paylaşmayı unutma.",
        ],
      },
    ],
  },
  {
    href: "/testimonials",
    label: "Yorumlar",
    intro:
      "Öğrenci yorumlarını burada yönetirsin — landing sayfandaki yorumlar bölümünü besler.",
    sections: [
      {
        title: "Yorum yönetimi",
        items: [
          "Öğrenci adı, yorum metni ve puanla yeni yorum ekle; dilediğin zaman düzenle veya kaldır.",
          "Yorumlar landing sayfanda otomatik döner; en güçlü yorumları öne alabilirsin.",
        ],
      },
    ],
  },
  {
    href: "/settings",
    label: "Ayarlar",
    intro:
      "Sitenin ve hesabının tüm ayarları burada, soldaki gruplara ayrılmış hâlde durur. Yaptığın değişiklikler landing sayfana anında yansır.",
    sections: [
      {
        title: "Marka & Tasarım",
        items: [
          "Marka adı ve logo; sitenin landing şablonu (6 hazır şablon arasında geçiş yapabilirsin).",
          "Site modu: hazır şablonla devam et veya Builder moduna geçip siteni bölüm bölüm sıfırdan kurgula.",
          "Panel teması: kendi dashboard'unun renk temasını seç.",
        ],
      },
      {
        title: "Site İçeriği",
        items: [
          "Hero bölümü: başlık, alt başlık, arka plan görseli/videosu.",
          "Metinler, S.S.S. soruları, dönüşümlerin ve yorumların sitedeki görünümü — hepsi sekmelerden yönetilir.",
        ],
      },
      {
        title: "Paketler, İletişim & Yasal",
        items: [
          "Paket vitrini ve alan adı bilgileri.",
          "WhatsApp numarası ve sosyal medya linkleri — landing'deki WhatsApp butonu buradan beslenir.",
          "KVKK, kullanım koşulları gibi yasal sayfa metinleri.",
        ],
      },
      {
        title: "Hesap & Güvenlik",
        items: [
          "E-posta bilgin ve şifre sıfırlama.",
          "Rehber ayarı: sayfa üstündeki rehber barını buradan açıp kapatabilir, turu yeniden başlatabilirsin.",
        ],
      },
    ],
  },
];

export const STUDENT_GUIDE_PAGES: GuidePageContent[] = [
  {
    href: "",
    label: "Ana Sayfa",
    intro:
      "Burası senin panelin. Koçunun sana atadığı her şeyin özeti bu ekranda durur.",
    sections: [
      {
        title: "Bu sayfada ne görürsün",
        items: [
          "Bugünkü antrenmanın ve beslenme planının özeti.",
          "Koçunun son atamaları ve geri bildirimleri.",
          "Alt (veya yan) menüden Antrenman, Beslenme, Check-in, İlerleme ve Ayarlar bölümlerine geçersin.",
          "Köşedeki WhatsApp butonuyla koçuna doğrudan yazabilirsin.",
        ],
      },
    ],
  },
  {
    href: "/training",
    label: "Antrenman",
    intro:
      "Koçunun sana atadığı antrenman programı burada. Haftalık plana göre ilerler, her seti kaydedersin.",
    sections: [
      {
        title: "Antrenmanını yap",
        items: [
          "Haftalık görünümden günün antrenmanını aç.",
          "Her egzersizde set × tekrar hedefini görürsün; tamamladıkça işaretle.",
          "Kaldırdığın ağırlığı ve tekrarı kaydet — ilerleme grafiklerine otomatik işlenir.",
          "Egzersizi bilmiyorsan video bağlantısından nasıl yapıldığını izleyebilirsin; ekipman yoksa alternatif egzersize geçebilirsin.",
        ],
      },
    ],
  },
  {
    href: "/nutrition",
    label: "Beslenme",
    intro:
      "Koçunun sana hazırladığı beslenme planı burada: hedeflerin, öğünlerin ve takibin.",
    sections: [
      {
        title: "Planını takip et",
        items: [
          "Günlük kalori ve makro hedeflerini görürsün.",
          "Öğünlerdeki besinleri ve gramajları incele; tamamladığın öğünleri işaretle.",
          "Öğün Kaydı bölümünden yediklerini fotoğrafla kaydedebilirsin — koçun görür ve geri bildirim verir.",
        ],
      },
    ],
  },
  {
    href: "/nutrition/log",
    label: "Öğün Kaydı",
    intro:
      "Gün içinde ne yediğini burada kaydedersin. Koçun bu kayıtları görür ve geri bildirim verir.",
    sections: [
      {
        title: "Kayıt tutma",
        items: [
          "Öğününü seç, fotoğrafını ekle ve istersen not yaz.",
          "Düzenli kayıt tutmak koçunun planını sana göre ayarlamasını kolaylaştırır.",
        ],
      },
    ],
  },
  {
    href: "/checkin",
    label: "Check-in",
    intro:
      "Haftalık check-in, koçunun gelişimini takip etmesinin en önemli yolu. Her hafta doldurmayı alışkanlık edin.",
    sections: [
      {
        title: "Check-in doldurma",
        items: [
          "Kilonu ve vücut ölçümlerini gir.",
          "İlerleme fotoğraflarını yükle — fotoğrafların gizlidir, yalnızca koçun görebilir.",
          "Haftanı değerlendir: uyku, enerji, zorlandığın noktalar.",
          "Koçun check-in'ini inceleyip geri bildirim yazar; cevabını yine burada görürsün.",
        ],
      },
    ],
  },
  {
    href: "/progress",
    label: "İlerleme",
    intro:
      "Buraya geldikçe yolun ne kadarını katettiğini görürsün: grafikler, uyum ve fotoğraflarla.",
    sections: [
      {
        title: "Neler izlenir",
        items: [
          "Kilo ve ölçüm değişim grafikleri (check-in verilerinden).",
          "Antrenman uyumun — hangi günler antrenman yaptığın.",
          "Fotoğraf galerisi: check-in fotoğraflarınla değişimini yan yana karşılaştır.",
        ],
      },
    ],
  },
  {
    href: "/settings",
    label: "Ayarlar",
    intro: "Panelini kendine göre özelleştirdiğin bölüm.",
    sections: [
      {
        title: "Ayarların",
        items: [
          "Panel teması: renk temasını seç.",
          "Panel düzeni: menünün konumunu (alt/sol/sağ) belirle.",
          "Bildirim tercihleri: hangi durumlarda bildirim alacağını seç.",
          "Rehber ayarı: sayfa üstündeki rehber barını açıp kapatabilir, tanıtım turunu yeniden başlatabilirsin.",
        ],
      },
    ],
  },
];
