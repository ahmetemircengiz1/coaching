export interface SupplementData {
  name: string;
  category: string;
  dosage: string;
  timing: string;
  notes: string;
}

export const supplementDatabase: SupplementData[] = [
  // Protein
  { name: "Whey Protein", category: "Protein", dosage: "30g (1 ölçek)", timing: "Antrenman Sonrası", notes: "Hızlı emilen protein" },
  { name: "Kazein Protein", category: "Protein", dosage: "30g (1 ölçek)", timing: "Akşam", notes: "Yavaş emilen, gece kullanımı ideal" },
  { name: "İzolat Whey Protein", category: "Protein", dosage: "25g (1 ölçek)", timing: "Antrenman Sonrası", notes: "Laktoz hassasiyeti olanlar için" },
  { name: "Vegan Protein (Bezelye+Pirinç)", category: "Protein", dosage: "30g (1 ölçek)", timing: "Antrenman Sonrası", notes: "Bitkisel protein kaynağı" },
  { name: "Kollajen Protein", category: "Protein", dosage: "10g", timing: "Sabah", notes: "Eklem ve cilt sağlığı" },

  // Amino Asitler
  { name: "BCAA (2:1:1)", category: "Amino Asit", dosage: "5-10g", timing: "Antrenman Sırası", notes: "Lösin, izolösin, valin" },
  { name: "EAA (Esansiyel Amino Asit)", category: "Amino Asit", dosage: "10g", timing: "Antrenman Sırası", notes: "Tüm esansiyel aminoasitler" },
  { name: "L-Glutamin", category: "Amino Asit", dosage: "5g", timing: "Antrenman Sonrası", notes: "Toparlanma ve bağışıklık" },
  { name: "Beta-Alanin", category: "Amino Asit", dosage: "3-5g", timing: "Antrenman Öncesi", notes: "Dayanıklılık artırır, karıncalanma yapabilir" },
  { name: "L-Sitrülin Malat", category: "Amino Asit", dosage: "6-8g", timing: "Antrenman Öncesi", notes: "Kan akışı ve pompa artırır" },
  { name: "L-Karnitin", category: "Amino Asit", dosage: "1-2g", timing: "Sabah", notes: "Yağ metabolizmasını destekler" },
  { name: "Taurin", category: "Amino Asit", dosage: "1-2g", timing: "Antrenman Öncesi", notes: "Enerji ve hidrasyon" },

  // Performans
  { name: "Kreatin Monohidrat", category: "Performans", dosage: "5g", timing: "Herhangi bir öğünle", notes: "Güç ve kas artışı, en çok araştırılan takviye" },
  { name: "Kafein", category: "Performans", dosage: "200-400mg", timing: "Antrenman Öncesi (30dk)", notes: "Enerji ve odaklanma, akşam kullanmayın" },
  { name: "Pre-Workout", category: "Performans", dosage: "1 ölçek", timing: "Antrenman Öncesi (20-30dk)", notes: "Kafein + beta-alanin + sitrülin karışımı" },
  { name: "HMB", category: "Performans", dosage: "3g", timing: "Antrenman Öncesi", notes: "Kas kaybını önlemeye yardımcı" },
  { name: "Ashwagandha (KSM-66)", category: "Performans", dosage: "600mg", timing: "Sabah", notes: "Stres azaltır, testosteron destekler" },

  // Vitaminler
  { name: "Vitamin D3", category: "Vitamin", dosage: "2000-4000 IU", timing: "Sabah (yağlı öğünle)", notes: "Kemik sağlığı, bağışıklık" },
  { name: "Vitamin C", category: "Vitamin", dosage: "500-1000mg", timing: "Sabah", notes: "Antioksidan, bağışıklık" },
  { name: "B Kompleks", category: "Vitamin", dosage: "1 tablet", timing: "Sabah", notes: "Enerji metabolizması" },
  { name: "Vitamin E", category: "Vitamin", dosage: "400 IU", timing: "Sabah (yağlı öğünle)", notes: "Antioksidan" },
  { name: "Vitamin K2 (MK-7)", category: "Vitamin", dosage: "100-200mcg", timing: "Sabah (D3 ile birlikte)", notes: "Kalsiyum metabolizması" },
  { name: "Multivitamin", category: "Vitamin", dosage: "1 tablet", timing: "Sabah", notes: "Genel vitamin-mineral desteği" },

  // Mineraller
  { name: "ZMA (Çinko+Magnezyum+B6)", category: "Mineral", dosage: "1-2 kapsül", timing: "Akşam (yatmadan önce)", notes: "Uyku kalitesi ve toparlanma" },
  { name: "Magnezyum Bisglisinat", category: "Mineral", dosage: "200-400mg", timing: "Akşam", notes: "Kas gevşetme, uyku" },
  { name: "Çinko", category: "Mineral", dosage: "15-30mg", timing: "Akşam", notes: "Bağışıklık, testosteron" },
  { name: "Demir", category: "Mineral", dosage: "14-18mg", timing: "Sabah (aç karnına)", notes: "Özellikle kadınlar için önemli" },
  { name: "Kalsiyum", category: "Mineral", dosage: "500-1000mg", timing: "Öğle", notes: "Kemik sağlığı" },
  { name: "Selenyum", category: "Mineral", dosage: "200mcg", timing: "Sabah", notes: "Tiroid fonksiyonu" },
  { name: "Potasyum", category: "Mineral", dosage: "200-400mg", timing: "Öğle", notes: "Elektrolit dengesi" },

  // Yağ Asitleri
  { name: "Omega-3 (Balık Yağı)", category: "Yağ Asidi", dosage: "2-3g (EPA+DHA)", timing: "Sabah (yağlı öğünle)", notes: "İltihap azaltır, kalp sağlığı" },
  { name: "CLA", category: "Yağ Asidi", dosage: "3-4g", timing: "Öğünlerle", notes: "Yağ yakımını destekler" },
  { name: "MCT Yağı", category: "Yağ Asidi", dosage: "1-2 yemek kaşığı", timing: "Sabah", notes: "Hızlı enerji kaynağı" },

  // Sindrim & Bağırsak
  { name: "Probiyotik", category: "Sindirim", dosage: "10-50 milyar CFU", timing: "Sabah (aç karnına)", notes: "Bağırsak sağlığı" },
  { name: "Sindirim Enzimi", category: "Sindirim", dosage: "1 kapsül", timing: "Öğünlerle", notes: "Besin emilimini artırır" },
  { name: "Psyllium Husk (Karnıyarık Otu)", category: "Sindirim", dosage: "5-10g", timing: "Akşam", notes: "Lif takviyesi, sindirim düzeni" },

  // Eklem & Bağ Doku
  { name: "Glukozamin + Kondroitin", category: "Eklem", dosage: "1500mg + 1200mg", timing: "Sabah", notes: "Eklem sağlığı ve kıkırdak desteği" },
  { name: "MSM", category: "Eklem", dosage: "1-3g", timing: "Sabah", notes: "İltihap ve eklem ağrısı" },
  { name: "Kurkumin (Zerdeçal)", category: "Eklem", dosage: "500-1000mg", timing: "Öğünlerle", notes: "Güçlü antiinflamatuar, biyoperinle alın" },

  // Uyku & Stres
  { name: "Melatonin", category: "Uyku", dosage: "1-3mg", timing: "Akşam (yatmadan 30dk önce)", notes: "Uyku düzeni, jet lag" },
  { name: "L-Teanin", category: "Uyku", dosage: "200mg", timing: "Akşam", notes: "Sakinleştirici, kafeinle sinerjik" },
  { name: "GABA", category: "Uyku", dosage: "500-750mg", timing: "Akşam", notes: "Rahatlama ve uyku kalitesi" },
];

export const supplementCategories = [
  "Protein",
  "Amino Asit",
  "Performans",
  "Vitamin",
  "Mineral",
  "Yağ Asidi",
  "Sindirim",
  "Eklem",
  "Uyku",
];
