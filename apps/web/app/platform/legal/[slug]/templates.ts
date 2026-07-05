export type LegalSlug = "gizlilik" | "kvkk" | "kullanim" | "mesafeli" | "iade" | "cerez";

interface LegalTemplate {
  title: string;
  lastUpdated: string;
  body: string;
}

const LAST_UPDATED = "10 Mayıs 2026";

export const PLATFORM_LEGAL_TEMPLATES: Record<LegalSlug, LegalTemplate> = {
  gizlilik: {
    title: "Gizlilik Politikası",
    lastUpdated: LAST_UPDATED,
    body: `1. GİRİŞ
Shred ("Platform", "Biz", "Şirketimiz") olarak kullanıcılarımızın ("Siz", "Kullanıcı") gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, https://shred.com.tr adresi ve alt alan adları üzerinden sunduğumuz hizmetler kapsamında topladığımız kişisel verilerin nasıl işlendiğini, saklandığını ve korunduğunu açıklamaktadır.

2. TOPLANAN VERİLER
Platformumuzu kullanırken aşağıdaki kişisel verilerinizi toplayabiliriz:

• Kimlik Bilgileri: Ad, soyad, doğum tarihi
• İletişim Bilgileri: E-posta adresi, telefon numarası, adres
• Hesap Bilgileri: Kullanıcı adı, şifre (şifrelenmiş), profil fotoğrafı
• Ödeme Bilgileri: Fatura adresi, ödeme yöntemi (kart bilgileri Iyzico/Stripe tarafından PCI-DSS uyumlu olarak işlenir)
• Kullanım Verileri: IP adresi, tarayıcı türü, ziyaret tarihi, sayfa görüntülemeleri
• Sağlık ve Fitness Verileri (öğrenciler için): Boy, kilo, vücut ölçüleri, antrenman geçmişi, beslenme planları

3. VERİLERİN İŞLENME AMAÇLARI
Toplanan veriler aşağıdaki amaçlarla işlenir:

• Hizmet sunumu ve hesap yönetimi
• Ödeme işlemlerinin gerçekleştirilmesi
• Müşteri desteği sağlanması
• Yasal yükümlülüklerin yerine getirilmesi
• Hizmet iyileştirme ve analitik
• Pazarlama iletişimi (açık rıza ile)

4. VERİLERİN PAYLAŞIMI
Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:

• Yasal zorunluluk halinde (mahkeme kararı, savcılık talebi)
• Hizmet sağlayıcılarımız (Supabase, Vercel, Iyzico, Stripe) ile teknik altyapı amacıyla
• Açık rızanızın bulunması durumunda

5. VERİLERİN SAKLANMA SÜRESİ
Verileriniz, toplanma amacı için gerekli olan süre boyunca veya yasal saklama yükümlülükleri çerçevesinde muhafaza edilir. Hesabınızı kapattığınızda, yasal saklama yükümlülükleri dışındaki verileriniz 30 gün içinde silinir.

6. KULLANICI HAKLARI
KVKK kapsamında aşağıdaki haklara sahipsiniz:

• Verilerinizin işlenip işlenmediğini öğrenme
• İşlenen verileriniz hakkında bilgi talep etme
• İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme
• Verilerinizin düzeltilmesini veya silinmesini isteme
• İşlemeye itiraz etme

7. VERİ GÜVENLİĞİ
Verilerinizi korumak için endüstri standardı şifreleme (HTTPS/TLS), erişim kontrolü, düzenli güvenlik denetimleri ve veri tabanı yedeklemeleri uyguluyoruz.

8. ÇEREZLER
Çerez kullanımımız için lütfen Çerez Politikamızı inceleyin.

9. POLİTİKA DEĞİŞİKLİKLERİ
Bu politikada zaman zaman değişiklikler yapabiliriz. Önemli değişiklikler size e-posta yoluyla bildirilecektir.

10. İLETİŞİM
Gizlilik konusundaki sorularınız için bizimle iletişime geçebilirsiniz.`,
  },

  kvkk: {
    title: "KVKK Aydınlatma Metni",
    lastUpdated: LAST_UPDATED,
    body: `6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU KAPSAMINDA AYDINLATMA METNİ

1. VERİ SORUMLUSU
Shred, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla hareket etmektedir.

2. KİŞİSEL VERİLERİN İŞLENME AMACI
Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

a) Sözleşmesel ilişkinin kurulması ve ifası
   • Hesap oluşturma ve yönetme
   • Ödeme işlemlerinin gerçekleştirilmesi
   • Hizmet sunumu

b) Yasal yükümlülüklerin yerine getirilmesi
   • Vergi mevzuatı
   • Ticaret hukuku
   • Tüketici hukuku

c) Meşru menfaatlerin korunması
   • Hizmet kalitesinin iyileştirilmesi
   • Güvenlik önlemleri
   • Dolandırıcılığın önlenmesi

d) Açık rıza gerektiren işlemler
   • Pazarlama iletişimi
   • Kişiselleştirilmiş içerik sunumu

3. KİŞİSEL VERİLERİN AKTARILMASI
Kişisel verileriniz, KVKK md. 8 ve 9'da öngörülen şartlar çerçevesinde aşağıdaki taraflara aktarılabilir:

• Yetkili kamu kurum ve kuruluşları
• Yasal yükümlülükler kapsamında ilgili merciler
• Hizmet sağlayıcılarımız (bulut altyapı, ödeme işlemcileri, e-posta hizmeti)
• Yurt dışında bulunan veri merkezleri (yeterli korumanın sağlandığı ülkeler)

4. KİŞİSEL VERİ TOPLAMA YÖNTEMİ VE HUKUKİ SEBEBİ
Kişisel verileriniz, Platform üzerinden elektronik ortamda toplanmakta olup; KVKK md. 5/2 (a, c, ç, e, f) ve md. 6/3 hükümleri kapsamında işlenmektedir.

5. KVKK KAPSAMINDAKİ HAKLARINIZ
KVKK md. 11 uyarınca aşağıdaki haklara sahipsiniz:

a) Kişisel verilerinizin işlenip işlenmediğini öğrenme
b) İşlenmişse bilgi talep etme
c) İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
ç) Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
d) Eksik veya yanlış işlenmiş olması halinde düzeltilmesini isteme
e) KVKK md. 7'de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme
f) (d) ve (e) bentleri uyarınca yapılan işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme
g) Münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonuç ortaya çıkmasına itiraz etme
ğ) Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme

6. BAŞVURU YOLU
Yukarıda belirtilen haklarınızı kullanmak için "destek@shred.com.tr" adresinden bizimle iletişime geçebilirsiniz. Başvurunuz 30 gün içinde yanıtlanacaktır.`,
  },

  kullanim: {
    title: "Kullanım Koşulları",
    lastUpdated: LAST_UPDATED,
    body: `1. TARAFLAR VE TANIMLAR
Bu Kullanım Koşulları, Shred ("Platform") ile Platform'u kullanan gerçek ve tüzel kişiler ("Kullanıcı") arasında geçerlidir.

2. HİZMETİN KAPSAMI
Shred, fitness ve sağlık koçlarına yönelik bir SaaS platformudur. Aşağıdaki hizmetleri sunmaktadır:

• Beyaz etiketli koç web sitesi oluşturma
• Öğrenci yönetim sistemi
• Antrenman ve beslenme programı oluşturucu
• Mesajlaşma ve iletişim araçları
• Ödeme entegrasyon altyapısı

3. HESAP OLUŞTURMA VE KULLANIM
3.1. Platform'u kullanmak için 18 yaşını doldurmuş olmanız gerekmektedir.
3.2. Hesap oluştururken doğru, güncel ve eksiksiz bilgi sağlamayı taahhüt edersiniz.
3.3. Şifrenizin gizliliğinden ve hesabınızda gerçekleştirilen tüm işlemlerden siz sorumlusunuz.
3.4. Tek hesap kuralı: Her kullanıcı yalnızca bir aktif hesap oluşturabilir.

4. ÜCRETLENDİRME VE ÖDEME
4.1. Platform paketleri Fiyatlandırma sayfasında belirtilen ücretler üzerinden satılmaktadır.
4.2. Aylık abonelikler her ay otomatik yenilenir.
4.3. Ödeme bilgileri PCI-DSS uyumlu ödeme işlemcileri (Iyzico/Stripe) tarafından işlenir.
4.4. Ücret iadesi politikamız ayrıca düzenlenmiştir (bkz. İade Politikası).

5. YASAK FAALİYETLER
Platform üzerinde aşağıdaki faaliyetler kesinlikle yasaktır:

• Yasalara aykırı içerik paylaşımı
• Telif hakkı ihlalleri
• Spam, dolandırıcılık veya kimlik hırsızlığı
• Platform güvenliğini tehlikeye atacak faaliyetler
• Otomatik scraping veya bot kullanımı (yetkili API dışında)
• Diğer kullanıcıları taciz etme veya rahatsız etme
• Sahte değerlendirme veya yanıltıcı reklam

6. FİKRİ MÜLKİYET HAKLARI
6.1. Platform ve içeriği Shred'in fikri mülkiyetidir.
6.2. Kullanıcılar Platform'a yükledikleri içeriklerin sahibidir; ancak Platform'a sınırlı, dünya çapında, münhasır olmayan, devredilebilir bir kullanım lisansı verirler.
6.3. Platform marka, logo ve tasarımları izinsiz kullanılamaz.

7. SORUMLULUK SINIRLAMASI
7.1. Platform "olduğu gibi" sunulmaktadır; kesintisiz veya hatasız çalışacağı garanti edilmemektedir.
7.2. Shred, Platform aracılığıyla oluşturulan koç-öğrenci ilişkisinin tarafı değildir; bu ilişkiden doğan ihtilaflarda sorumlu tutulamaz.
7.3. Sağlık tavsiyeleri konusunda Platform yalnızca araç görevi görür; sağlık sorunlarınız için doktor görüşü almanız önerilir.

8. SÖZLEŞMENİN FESHİ
8.1. Kullanıcı, hesabını dilediği zaman sona erdirebilir.
8.2. Shred, Kullanım Koşulları'nın ihlali durumunda hesabı uyarı vermeksizin askıya alabilir veya kapatabilir.

9. UYUŞMAZLIKLARIN ÇÖZÜMÜ
Bu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti hukuku uygulanır. İhtilaflar İstanbul Mahkemeleri ve İcra Daireleri'nin yetkisindedir.

10. DEĞİŞİKLİKLER
Shred bu Kullanım Koşulları'nı zaman zaman güncelleyebilir. Önemli değişiklikler kullanıcılara e-posta ile bildirilir.`,
  },

  mesafeli: {
    title: "Mesafeli Satış Sözleşmesi",
    lastUpdated: LAST_UPDATED,
    body: `MADDE 1 - TARAFLAR
SATICI: Shred
ALICI: Platform üzerinden hizmet satın alan kullanıcı

MADDE 2 - SÖZLEŞMENİN KONUSU
İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait Platform üzerinden elektronik ortamda sipariş verdiği, sözleşmede belirtilen niteliklerdeki dijital hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.

MADDE 3 - HİZMET BİLGİLERİ
Satılan hizmetin türü, paket adı, abonelik süresi, ödeme tutarı ve KDV dahil toplam fiyatı ödeme öncesinde Platform üzerinde açıkça belirtilir.

MADDE 4 - GENEL HÜKÜMLER
4.1. ALICI, hizmetin temel nitelikleri, satış fiyatı ve ödeme şekli hakkında bilgilendirildiğini ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
4.2. Hizmet, ödeme onayını takiben aktive edilir ve dijital ortamda sunulur.
4.3. Hizmetin sağlanması süresince Platform yükümlülüklerini yerine getirmekle yükümlüdür.

MADDE 5 - CAYMA HAKKI
5.1. ALICI, hizmetin ifasının başladığı tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
5.2. Ancak Mesafeli Sözleşmeler Yönetmeliği md. 15/(g) uyarınca, "Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler" kapsamında, ALICI'nın açık rızası ile hizmetin ifasına başlanmışsa cayma hakkı kullanılamayabilir.
5.3. Cayma hakkının kullanımı için "destek@shred.com.tr" adresine bildirimde bulunulması gerekir.

MADDE 6 - HİZMETİN İFASI VE TESLİM
6.1. Hizmet, ödeme onayını takiben en geç 24 saat içinde aktive edilir.
6.2. Teknik nedenlerle aktivasyonun gecikmesi durumunda ALICI bilgilendirilir.

MADDE 7 - ÖDEME
7.1. Ödemeler kredi kartı ile gerçekleştirilir.
7.2. Ödeme bilgileri PCI-DSS uyumlu altyapıda saklanır.
7.3. Aylık abonelikler her ay otomatik yenilenir; ALICI iptal etmediği sürece ödeme tahsilatı devam eder.

MADDE 8 - YÜKÜMLÜLÜKLERİN İHLALİ
8.1. Tarafların yükümlülüklerini ihlali halinde ilgili tarafça tazminat talep edilebilir.
8.2. Mücbir sebep halleri (doğal afet, savaş, salgın vb.) bu hükmün dışındadır.

MADDE 9 - YETKİLİ MAHKEME
İşbu sözleşmenin uygulanmasında doğacak uyuşmazlıklarda, Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.

MADDE 10 - YÜRÜRLÜK
Sözleşme, ALICI'nın elektronik ortamda onaylaması ile kurulmuş ve yürürlüğe girmiştir.`,
  },

  iade: {
    title: "İade ve İptal Politikası",
    lastUpdated: LAST_UPDATED,
    body: `1. GENEL İLKE
Shred olarak müşteri memnuniyetini ön planda tutuyoruz. Bu politika, Platform üzerinden satın alınan abonelik hizmetlerinin iadesi ve iptali ile ilgili kuralları açıklar.

2. ABONELİK İPTALİ
2.1. Aboneliğinizi dilediğiniz zaman hesap ayarlarından iptal edebilirsiniz.
2.2. İptal işlemi, mevcut fatura döneminin sonunda etkin olur; o döneme kadar hizmete erişiminiz devam eder.
2.3. İptal sonrası otomatik yenileme durdurulur ve sonraki dönemde ücret tahsil edilmez.

3. ÜCRET İADESİ
3.1. İlk 14 Gün Garantisi:
   • Yeni abonelik satın alımlarında ilk 14 gün içinde tam iade hakkınız vardır.
   • Bu süre içinde "destek@shred.com.tr" adresine yazılı talep iletmeniz gerekir.
   • İade, başvuru tarihinden itibaren 14 iş günü içinde aynı ödeme yöntemine yapılır.

3.2. 14 Gün Sonrası:
   • İlk 14 günden sonraki iptal taleplerinde, ödenmiş kısma orantılı iade yapılmaz.
   • Aboneliğiniz mevcut fatura döneminin sonuna kadar aktif kalır.

3.3. Yıllık Aboneliklerde İade:
   • Yıllık abonelik iptallerinde, kullanılan aylar düşülerek kalan döneme orantılı iade yapılabilir.

4. İADE EDİLEMEYEN DURUMLAR
Aşağıdaki durumlarda iade yapılmaz:

• Kullanım Koşulları'nın ihlali nedeniyle hesabın askıya alınması veya kapatılması
• 14 günlük iade süresi geçmiş abonelikler (yıllık abonelikler hariç)
• Promosyon kodları veya hediye abonelikler
• Aktivasyon ücretleri (varsa)

5. TEKNİK ARIZA NEDENİYLE İADE
Platform'da uzun süreli (24 saatten fazla) hizmet kesintisi yaşanması durumunda, etkilenen abonelik dönemi için orantılı iade veya hizmet uzatma sağlanır.

6. İADE BAŞVURUSU
İade talebi için aşağıdaki bilgileri "destek@shred.com.tr" adresine iletin:

• Adınız ve soyadınız
• Hesap e-posta adresi
• Sipariş numarası veya tarih
• İade talep gerekçesi
• Banka hesap bilgileri (banka transferi ile iade istiyorsanız)

7. CAYMA HAKKI
Mesafeli Sözleşmeler Yönetmeliği uyarınca cayma hakkı detayları için "Mesafeli Satış Sözleşmesi" sayfasını inceleyiniz.

8. UYUŞMAZLIK ÇÖZÜMÜ
İade veya iptal süreçlerinde yaşanan ihtilaflar için Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.

9. POLİTİKA GÜNCELLEMELERİ
Bu politika değiştirilebilir; önemli değişiklikler aktif kullanıcılara e-posta ile bildirilir. Mevcut abonelikler değişiklikten önceki şartlara tabi kalır.`,
  },

  cerez: {
    title: "Çerez Politikası",
    lastUpdated: LAST_UPDATED,
    body: `1. ÇEREZ NEDİR?
Çerezler, internet sitelerini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler, web sitesinin sizi tanımasına, tercihlerinizi hatırlamasına ve daha iyi bir kullanıcı deneyimi sunmasına yardımcı olur.

2. KULLANDIĞIMIZ ÇEREZ TÜRLERİ

2.1. Zorunlu Çerezler (Strictly Necessary)
Bu çerezler, web sitesinin temel işlevlerinin çalışması için gereklidir. Bunlar olmadan site düzgün çalışmaz.
   • Oturum yönetimi (login durumu)
   • Güvenlik (CSRF token)
   • Sepet ve form verileri

2.2. Performans Çerezleri (Performance)
Web sitesinin nasıl kullanıldığını anlamamıza ve performansı iyileştirmemize yardımcı olur.
   • Sayfa yükleme süreleri
   • Hata raporları
   • Ziyaretçi sayıları (anonim)

2.3. İşlevsel Çerezler (Functional)
Tercihlerinizi hatırlayarak gelişmiş bir deneyim sunar.
   • Dil tercihi
   • Tema seçimi (açık/koyu mod)
   • Önceki giriş bilgileri

2.4. Hedefleme/Reklam Çerezleri (Targeting)
Açık rızanız ile, ilgi alanlarınıza yönelik içerik ve reklam sunmak için kullanılır.
   • Google Analytics
   • Facebook Pixel (varsa)
   • Reklam ağı çerezleri

3. ÜÇÜNCÜ TARAF ÇEREZLERİ
Aşağıdaki üçüncü taraf hizmetler kendi çerezlerini kullanabilir:

• Google Analytics (analitik)
• Iyzico/Stripe (ödeme işlemleri)
• Vercel (CDN ve performans)
• Supabase (oturum yönetimi)

Bu hizmetlerin kendi gizlilik politikaları geçerlidir.

4. ÇEREZ TERCİHLERİNİZ
4.1. Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz:

• Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler
• Firefox: Tercihler → Gizlilik ve Güvenlik
• Safari: Tercihler → Gizlilik
• Edge: Ayarlar → Çerezler ve site izinleri

4.2. Zorunlu çerezleri devre dışı bırakırsanız sitenin bazı bölümleri çalışmayabilir.

4.3. Pazarlama ve reklam çerezleri için açık rızanızı sorduğumuz banner üzerinden tercihinizi belirleyebilirsiniz.

5. ÇEREZLERİN SAKLANMA SÜRESİ
• Oturum çerezleri: Tarayıcı kapatıldığında silinir
• Kalıcı çerezler: 30 gün ile 2 yıl arasında değişen sürelerde saklanır

6. KİŞİSEL VERİ KORUMA
Çerezler aracılığıyla toplanan veriler 6698 sayılı KVKK ve GDPR kapsamında korunur. Detaylar için Gizlilik Politikamızı inceleyebilirsiniz.

7. POLİTİKA GÜNCELLEMELERİ
Bu Çerez Politikası zaman zaman güncellenebilir. Güncellemeler bu sayfada yayınlandığı tarihte yürürlüğe girer.

8. İLETİŞİM
Çerez kullanımımız hakkında sorularınız için "destek@shred.com.tr" adresinden bize ulaşabilirsiniz.`,
  },
};
