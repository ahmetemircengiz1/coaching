/**
 * Sayfa rehberi içerikleri — her sayfa için kısa, GÖSTEREREK anlatan adımlar.
 * `target` bir CSS seçicisidir: adım o öğeyi spotlight ile vurgular ve
 * açıklamayı yanına koyar. target yoksa (veya öğe sayfada bulunamazsa)
 * adım ekranın ortasında küçük bir kart olarak gösterilir.
 * Dizi sırası aynı zamanda tur sırasıdır.
 */

export interface GuideStep {
  /** Vurgulanacak öğenin CSS seçicisi (opsiyonel) */
  target?: string;
  /** true → adım açılırken target tıklanır (grup/akordiyon açmak için) */
  click?: boolean;
  /** target yerine tıklanacak ayrı öğe (ör. akordiyonun başlık butonu) */
  clickTarget?: string;
  title: string;
  text: string;
}

export interface GuidePageContent {
  /** Panel köküne göre yol ("" = ana sayfa) */
  href: string;
  label: string;
  steps: GuideStep[];
}

export const COACH_GUIDE_PAGES: GuidePageContent[] = [
  {
    href: "",
    label: "Ana Sayfa",
    steps: [
      {
        title: "Koç paneline hoş geldin",
        text: "Burası genel bakış ekranın: aktif öğrencilerin, bekleyen check-in'ler ve son aktiviteler özet kartlarda durur. Bir karta tıklayınca ilgili sayfaya gidersin.",
      },
      {
        target: "[data-tour='sidebar-students']",
        title: "Menün",
        text: "Panelin bölümleri arasında buradan gezinirsin. Şimdi sana her sayfayı tek tek gezdireceğim — İleri'ye bas.",
      },
      {
        target: "[data-tour='sidebar-site']",
        title: "Siteni Aç",
        text: "Buradan kendi landing sayfanı yeni sekmede açıp öğrencilerinin gördüğü hâli her an kontrol edebilirsin.",
      },
    ],
  },
  {
    href: "/students",
    label: "Öğrenciler",
    steps: [
      {
        title: "Öğrencilerin",
        text: "Tüm öğrencilerin burada listelenir. İsme göre arayabilir, bir öğrenciye tıklayıp detayına girebilirsin.",
      },
      {
        target: "[data-guide='students-codes']",
        title: "Kayıt Kodları",
        text: "Kod Üret ile pakete bağlı tek kullanımlık kod oluştur ve öğrencine gönder. Öğrenci bu kodla sitenden kayıt olur, e-postasını doğrular ve otomatik olarak listene düşer.",
      },
      {
        title: "Öğrenci detayı",
        text: "Bir öğrenciye tıkladığında programları, beslenme planı, check-in'leri (fotoğraf + ölçüm), ilerleme grafikleri ve koç notların tek ekranda toplanır; geri bildirimlerini oradan yazarsın.",
      },
    ],
  },
  {
    href: "/programs",
    label: "Programlar",
    steps: [
      {
        target: "[data-guide='programs-create']",
        title: "Program Oluştur",
        text: "Buradan yeni program başlat: hazır şablonlardan birini kopyala ya da sıfırdan kur. Günlere antrenman, antrenmanlara egzersiz + set × tekrar eklersin.",
      },
      {
        title: "Atama ve takip",
        text: "Hazır programı bir veya birden çok öğrenciye atarsın. Öğrenci Antrenman sekmesinde görür, setleri tamamladıkça işaretler; kayıtlar ilerleme grafiklerine otomatik işlenir.",
      },
    ],
  },
  {
    href: "/exercises",
    label: "Egzersizler",
    steps: [
      {
        title: "Egzersiz kütüphanesi",
        text: "160+ hazır egzersiz kas grubuna ve ekipmana göre filtrelenir; programlarında bunları kullanırsın.",
      },
      {
        target: "[data-guide='exercises-create']",
        title: "Yeni Egzersiz",
        text: "Kendi egzersizini ad, kas grubu ve video linkiyle buradan eklersin — yalnızca sana görünür ve tüm programlarında kullanılabilir.",
      },
    ],
  },
  {
    href: "/nutrition",
    label: "Beslenme",
    steps: [
      {
        target: "[data-guide='nutrition-create']",
        title: "Yeni Plan",
        text: "Buradan beslenme planı oluştur: günlük kalori ve makro hedeflerini belirle, hazır besin veritabanından öğünlere besin ekle, istersen takviye önerisi koy.",
      },
      {
        title: "Atama ve takip",
        text: "Planı öğrenciye atarsın; öğrenci öğünlerini işaretler ve fotoğraflı öğün kaydı tutar. Sen de öğrenci detayından izleyip geri bildirim verirsin.",
      },
    ],
  },
  {
    href: "/packages",
    label: "Paketler",
    steps: [
      {
        target: "[data-guide='packages-create']",
        title: "Yeni Paket",
        text: "Ad, süre, fiyat ve özellik listesiyle koçluk paketi oluştur. Aktif paketler landing sayfandaki paket bölümünde otomatik görünür.",
      },
      {
        title: "Kodlarla bağlantı",
        text: "Öğrenci kayıt kodlarını bir pakete bağlarsın; öğrenci o kodla kayıt olunca doğru pakete otomatik yerleşir.",
      },
    ],
  },
  {
    href: "/transformations",
    label: "Dönüşümler",
    steps: [
      {
        title: "Dönüşümler",
        text: "Öğrencilerinin öncesi/sonrası fotoğraflarını buraya ekle — landing sayfandaki dönüşümler bölümünü besler. Yalnızca izin aldığın fotoğrafları paylaşmayı unutma.",
      },
    ],
  },
  {
    href: "/testimonials",
    label: "Yorumlar",
    steps: [
      {
        title: "Yorumlar",
        text: "Öğrenci yorumlarını burada yönetirsin; eklediklerin landing sayfandaki yorumlar bölümünde döner.",
      },
    ],
  },
  {
    href: "/settings",
    label: "Ayarlar",
    steps: [
      {
        target: "[data-guide='settings-groups']",
        title: "Ayar grupları",
        text: "Sitenin ve hesabının tüm ayarları bu gruplarda toplanır. Şimdi hepsini tek tek açıp gezeceğiz — burada yaptığın her değişiklik landing sayfana anında yansır.",
      },
      {
        target: "[data-guide='settings-group-marka-site']",
        click: true,
        title: "Marka & Tasarım",
        text: "Marka adın, site şablonun (6 hazır tasarım) ve panelinin görünümü bu grupta.",
      },
      {
        target: "#acc-site-modu",
        clickTarget: "#acc-site-modu > button",
        title: "Site Modu",
        text: "Siteni hazır şablonla mı kullanacaksın, yoksa Builder ile bölüm bölüm sıfırdan mı kurgulayacaksın? Modlar arasında buradan geçersin.",
      },
      {
        target: "#acc-panel-temasi",
        clickTarget: "#acc-panel-temasi > button",
        title: "Panel Teması",
        text: "Yönetim panelinin (şu an baktığın ekranın) renk temasını buradan seçersin — sitenin görünümünü etkilemez.",
      },
      {
        target: "[data-guide='settings-group-site-icerigi']",
        click: true,
        title: "Site İçeriği",
        text: "Hero başlığı ve görseli/videosu, site metinlerin, S.S.S. soruların, dönüşümler ve yorumların sitedeki görünümü — hepsi bu gruptaki sekmelerde düzenlenir.",
      },
      {
        target: "[data-guide='settings-group-paketler-odeme']",
        click: true,
        title: "Paketler",
        text: "Koçluk paketlerinin site vitrini ve alan adı/plan bilgilerin bu grupta.",
      },
      {
        target: "[data-guide='settings-group-iletisim-yasal']",
        click: true,
        title: "İletişim & Yasal",
        text: "WhatsApp numaran (sitedeki WhatsApp butonunu besler), sosyal medya linklerin ve KVKK/kullanım koşulları gibi yasal sayfaların burada.",
      },
      {
        target: "[data-guide='settings-group-hesap-guvenlik']",
        click: true,
        title: "Hesap & Güvenlik",
        text: "E-posta bilgin, şifre sıfırlama ve oturum işlemleri bu grupta.",
      },
      {
        target: "[data-guide='guide-settings-card']",
        title: "Rehber ayarı",
        text: "Bu karttan sayfa üstündeki rehber barını kapatıp açabilir, bu turu istediğin zaman yeniden başlatabilirsin.",
      },
      {
        target: "[data-guide='delete-account-card']",
        title: "Üyelik sonlandırma",
        text: "Hesabını ve siteni kalıcı olarak silmek istersen burası. Tur burada bitiyor — her sayfanın üstündeki Rehber barından istediğin an geri dönebilirsin!",
      },
    ],
  },
];

export const STUDENT_GUIDE_PAGES: GuidePageContent[] = [
  {
    href: "",
    label: "Ana Sayfa",
    steps: [
      {
        title: "Paneline hoş geldin",
        text: "Bugünkü antrenmanın, beslenme planın ve koçundan gelenler bu ekranda özetlenir. Köşedeki WhatsApp butonuyla koçuna doğrudan yazabilirsin.",
      },
      {
        target: "[data-guide='student-nav-training']",
        title: "Menün",
        text: "Bölümler arasında buradan gezinirsin. Şimdi sana her sayfayı kısaca gezdireceğim — İleri'ye bas.",
      },
    ],
  },
  {
    href: "/training",
    label: "Antrenman",
    steps: [
      {
        title: "Programın",
        text: "Koçunun atadığı haftalık programdan günün antrenmanını aç; her egzersizde set × tekrar hedefini görürsün.",
      },
      {
        title: "Kayıt tut",
        text: "Setleri tamamladıkça işaretle, ağırlık/tekrar gir — ilerleme grafiklerine otomatik işlenir. Egzersizi bilmiyorsan videosunu izleyebilirsin.",
      },
    ],
  },
  {
    href: "/nutrition",
    label: "Beslenme",
    steps: [
      {
        title: "Beslenme planın",
        text: "Koçunun hazırladığı plan: günlük kalori/makro hedeflerin ve öğünlerin burada. Besinleri ve gramajları her öğünün içinde görürsün.",
      },
      {
        title: "Öğünleri işaretle",
        text: "Tamamladığın öğünleri işaretle; Öğün Kaydı bölümünden de yediklerini fotoğrafla kaydedebilirsin — koçun görür ve geri bildirim verir.",
      },
    ],
  },
  {
    href: "/nutrition/log",
    label: "Öğün Kaydı",
    steps: [
      {
        title: "Öğün kaydı",
        text: "Ne yediğini fotoğraf ve notla kaydet. Düzenli kayıt tutmak, koçunun planını sana göre ayarlamasını kolaylaştırır.",
      },
    ],
  },
  {
    href: "/checkin",
    label: "Check-in",
    steps: [
      {
        title: "Haftalık check-in",
        text: "Her hafta kilonu ve ölçümlerini gir, ilerleme fotoğraflarını yükle — fotoğrafların gizlidir, yalnızca koçun görebilir.",
      },
      {
        title: "Geri bildirim",
        text: "Koçun check-in'ini inceleyip cevap yazar; yanıtını yine burada görürsün.",
      },
    ],
  },
  {
    href: "/progress",
    label: "İlerleme",
    steps: [
      {
        title: "İlerlemen",
        text: "Kilo/ölçüm grafiklerin, antrenman uyumun ve fotoğraf galerin burada — değişimini bu sayfadan izlersin.",
      },
    ],
  },
  {
    href: "/settings",
    label: "Ayarlar",
    steps: [
      {
        title: "Ayarların",
        text: "Panel temanı ve menü konumunu seç, bildirim tercihlerini yönet. Rehber ayarı ve üyelik sonlandırma da burada. Tur bitti — Rehber barından istediğin an geri dönebilirsin.",
      },
    ],
  },
];
