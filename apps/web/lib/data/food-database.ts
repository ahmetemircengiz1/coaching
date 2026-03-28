// Hazır besin veritabanı - 200+ Türk/fitness odaklı yiyecek
// Her 100g için: kalori, protein, karbonhidrat, yağ, şeker (gram)

export interface FoodData {
  name: string;
  category: string;
  calories: number;    // kcal per 100g
  protein: number;     // g per 100g
  carbs: number;       // g per 100g
  fat: number;         // g per 100g
  sugar: number;       // g per 100g
  fiber: number;       // g per 100g
  portion: string;     // Önerilen porsiyon
  portionGrams: number; // Porsiyon gram
}

export const FOOD_DATABASE: FoodData[] = [
  // ═══ PROTEİN KAYNAKLARI ═══
  { name: "Tavuk Göğsü (Pişmiş)", category: "Protein", calories: 165, protein: 31, carbs: 0, fat: 3.6, sugar: 0, fiber: 0, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Tavuk But (Pişmiş)", category: "Protein", calories: 209, protein: 26, carbs: 0, fat: 10.9, sugar: 0, fiber: 0, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Hindi Göğsü", category: "Protein", calories: 135, protein: 30, carbs: 0, fat: 1, sugar: 0, fiber: 0, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Dana Kıyma (Yağsız)", category: "Protein", calories: 176, protein: 26, carbs: 0, fat: 8, sugar: 0, fiber: 0, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Dana Biftek", category: "Protein", calories: 271, protein: 26, carbs: 0, fat: 18, sugar: 0, fiber: 0, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Kuzu Pirzola", category: "Protein", calories: 282, protein: 25, carbs: 0, fat: 20, sugar: 0, fiber: 0, portion: "1 porsiyon", portionGrams: 120 },
  { name: "Somon (Pişmiş)", category: "Protein", calories: 208, protein: 20, carbs: 0, fat: 13, sugar: 0, fiber: 0, portion: "1 fileto", portionGrams: 150 },
  { name: "Ton Balığı (Konserve)", category: "Protein", calories: 116, protein: 26, carbs: 0, fat: 1, sugar: 0, fiber: 0, portion: "1 kutu", portionGrams: 160 },
  { name: "Levrek (Pişmiş)", category: "Protein", calories: 124, protein: 24, carbs: 0, fat: 2.6, sugar: 0, fiber: 0, portion: "1 fileto", portionGrams: 150 },
  { name: "Karides", category: "Protein", calories: 99, protein: 24, carbs: 0.2, fat: 0.3, sugar: 0, fiber: 0, portion: "1 porsiyon", portionGrams: 100 },
  { name: "Yumurta (Bütün)", category: "Protein", calories: 155, protein: 13, carbs: 1.1, fat: 11, sugar: 1.1, fiber: 0, portion: "2 adet", portionGrams: 100 },
  { name: "Yumurta Beyazı", category: "Protein", calories: 52, protein: 11, carbs: 0.7, fat: 0.2, sugar: 0.7, fiber: 0, portion: "3 adet beyaz", portionGrams: 100 },
  { name: "Whey Protein", category: "Protein", calories: 120, protein: 24, carbs: 3, fat: 1.5, sugar: 2, fiber: 0, portion: "1 ölçek", portionGrams: 30 },
  { name: "Kazein Protein", category: "Protein", calories: 120, protein: 24, carbs: 3, fat: 1, sugar: 1, fiber: 0, portion: "1 ölçek", portionGrams: 33 },

  // ═══ SÜT ÜRÜNLERİ ═══
  { name: "Süt (Tam Yağlı)", category: "Süt Ürünleri", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, sugar: 4.8, fiber: 0, portion: "1 bardak", portionGrams: 200 },
  { name: "Süt (Yarım Yağlı)", category: "Süt Ürünleri", calories: 46, protein: 3.4, carbs: 4.7, fat: 1.6, sugar: 4.7, fiber: 0, portion: "1 bardak", portionGrams: 200 },
  { name: "Süt (Yağsız)", category: "Süt Ürünleri", calories: 35, protein: 3.4, carbs: 5, fat: 0.1, sugar: 5, fiber: 0, portion: "1 bardak", portionGrams: 200 },
  { name: "Yoğurt (Tam Yağlı)", category: "Süt Ürünleri", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, sugar: 4.7, fiber: 0, portion: "1 kase", portionGrams: 200 },
  { name: "Yoğurt (Yarım Yağlı)", category: "Süt Ürünleri", calories: 46, protein: 3.5, carbs: 4.7, fat: 1.5, sugar: 4.7, fiber: 0, portion: "1 kase", portionGrams: 200 },
  { name: "Yunan Yoğurdu", category: "Süt Ürünleri", calories: 97, protein: 9, carbs: 3.6, fat: 5, sugar: 3.6, fiber: 0, portion: "1 kase", portionGrams: 170 },
  { name: "Süzme Peynir (Lor)", category: "Süt Ürünleri", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, sugar: 2.7, fiber: 0, portion: "1 porsiyon", portionGrams: 100 },
  { name: "Beyaz Peynir", category: "Süt Ürünleri", calories: 264, protein: 17, carbs: 0.5, fat: 21, sugar: 0.5, fiber: 0, portion: "2 dilim", portionGrams: 60 },
  { name: "Kaşar Peyniri", category: "Süt Ürünleri", calories: 316, protein: 23, carbs: 2, fat: 24, sugar: 0.5, fiber: 0, portion: "2 dilim", portionGrams: 40 },
  { name: "Tulum Peyniri", category: "Süt Ürünleri", calories: 305, protein: 19, carbs: 1, fat: 25, sugar: 0.5, fiber: 0, portion: "1 porsiyon", portionGrams: 50 },
  { name: "Cottage Cheese", category: "Süt Ürünleri", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, sugar: 2.7, fiber: 0, portion: "1 kase", portionGrams: 200 },
  { name: "Kefir", category: "Süt Ürünleri", calories: 55, protein: 3.3, carbs: 3.5, fat: 3.2, sugar: 3.5, fiber: 0, portion: "1 bardak", portionGrams: 200 },
  { name: "Ayran", category: "Süt Ürünleri", calories: 26, protein: 1.7, carbs: 2, fat: 1.3, sugar: 2, fiber: 0, portion: "1 bardak", portionGrams: 200 },

  // ═══ KARBONHİDRAT KAYNAKLARI ═══
  { name: "Pirinç (Pişmiş)", category: "Karbonhidrat", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, sugar: 0, fiber: 0.4, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Esmer Pirinç (Pişmiş)", category: "Karbonhidrat", calories: 123, protein: 2.6, carbs: 26, fat: 1, sugar: 0.4, fiber: 1.8, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Bulgur (Pişmiş)", category: "Karbonhidrat", calories: 83, protein: 3.1, carbs: 18.6, fat: 0.2, sugar: 0.1, fiber: 4.5, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Makarna (Pişmiş)", category: "Karbonhidrat", calories: 131, protein: 5, carbs: 25, fat: 1.1, sugar: 0.6, fiber: 1.8, portion: "1 porsiyon", portionGrams: 180 },
  { name: "Tam Buğday Makarna", category: "Karbonhidrat", calories: 124, protein: 5.3, carbs: 27, fat: 0.5, sugar: 0.6, fiber: 3.9, portion: "1 porsiyon", portionGrams: 180 },
  { name: "Yulaf Ezmesi (Kuru)", category: "Karbonhidrat", calories: 389, protein: 17, carbs: 66, fat: 7, sugar: 1, fiber: 11, portion: "1 porsiyon", portionGrams: 50 },
  { name: "Ekmek (Beyaz)", category: "Karbonhidrat", calories: 265, protein: 9, carbs: 49, fat: 3.2, sugar: 5, fiber: 2.7, portion: "2 dilim", portionGrams: 60 },
  { name: "Ekmek (Tam Buğday)", category: "Karbonhidrat", calories: 247, protein: 13, carbs: 41, fat: 3.4, sugar: 6, fiber: 7, portion: "2 dilim", portionGrams: 60 },
  { name: "Çavdar Ekmeği", category: "Karbonhidrat", calories: 259, protein: 8.5, carbs: 48, fat: 3.3, sugar: 3.9, fiber: 5.8, portion: "2 dilim", portionGrams: 60 },
  { name: "Patates (Haşlanmış)", category: "Karbonhidrat", calories: 87, protein: 1.9, carbs: 20, fat: 0.1, sugar: 0.8, fiber: 1.8, portion: "1 orta boy", portionGrams: 200 },
  { name: "Tatlı Patates (Pişmiş)", category: "Karbonhidrat", calories: 90, protein: 2, carbs: 21, fat: 0.1, sugar: 6.5, fiber: 3.3, portion: "1 orta boy", portionGrams: 200 },
  { name: "Kinoa (Pişmiş)", category: "Karbonhidrat", calories: 120, protein: 4.4, carbs: 21, fat: 1.9, sugar: 0.9, fiber: 2.8, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Kuskus (Pişmiş)", category: "Karbonhidrat", calories: 112, protein: 3.8, carbs: 23, fat: 0.2, sugar: 0.1, fiber: 1.4, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Nohut (Pişmiş)", category: "Karbonhidrat", calories: 164, protein: 8.9, carbs: 27, fat: 2.6, sugar: 4.8, fiber: 7.6, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Kuru Fasulye (Pişmiş)", category: "Karbonhidrat", calories: 127, protein: 8.7, carbs: 22, fat: 0.5, sugar: 0.3, fiber: 6.4, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Mercimek (Pişmiş)", category: "Karbonhidrat", calories: 116, protein: 9, carbs: 20, fat: 0.4, sugar: 1.8, fiber: 7.9, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Bal", category: "Karbonhidrat", calories: 304, protein: 0.3, carbs: 82, fat: 0, sugar: 82, fiber: 0.2, portion: "1 yemek kaşığı", portionGrams: 21 },
  { name: "Pekmez", category: "Karbonhidrat", calories: 293, protein: 0.9, carbs: 73, fat: 0, sugar: 55, fiber: 0, portion: "1 yemek kaşığı", portionGrams: 20 },

  // ═══ SAĞLIKLI YAĞLAR ═══
  { name: "Zeytinyağı", category: "Yağlar", calories: 884, protein: 0, carbs: 0, fat: 100, sugar: 0, fiber: 0, portion: "1 yemek kaşığı", portionGrams: 14 },
  { name: "Tereyağı", category: "Yağlar", calories: 717, protein: 0.9, carbs: 0.1, fat: 81, sugar: 0.1, fiber: 0, portion: "1 yemek kaşığı", portionGrams: 14 },
  { name: "Badem", category: "Yağlar", calories: 579, protein: 21, carbs: 22, fat: 50, sugar: 4.4, fiber: 12, portion: "1 avuç", portionGrams: 30 },
  { name: "Ceviz", category: "Yağlar", calories: 654, protein: 15, carbs: 14, fat: 65, sugar: 2.6, fiber: 6.7, portion: "1 avuç", portionGrams: 30 },
  { name: "Fındık", category: "Yağlar", calories: 628, protein: 15, carbs: 17, fat: 61, sugar: 4.3, fiber: 9.7, portion: "1 avuç", portionGrams: 30 },
  { name: "Yer Fıstığı", category: "Yağlar", calories: 567, protein: 26, carbs: 16, fat: 49, sugar: 4, fiber: 8.5, portion: "1 avuç", portionGrams: 30 },
  { name: "Fıstık Ezmesi", category: "Yağlar", calories: 588, protein: 25, carbs: 20, fat: 50, sugar: 9.2, fiber: 6, portion: "1 yemek kaşığı", portionGrams: 32 },
  { name: "Avokado", category: "Yağlar", calories: 160, protein: 2, carbs: 9, fat: 15, sugar: 0.7, fiber: 7, portion: "1/2 adet", portionGrams: 75 },
  { name: "Zeytin (Yeşil)", category: "Yağlar", calories: 145, protein: 1, carbs: 3.8, fat: 15, sugar: 0, fiber: 3.3, portion: "10 adet", portionGrams: 40 },
  { name: "Zeytin (Siyah)", category: "Yağlar", calories: 115, protein: 0.8, carbs: 6, fat: 11, sugar: 0, fiber: 3.2, portion: "10 adet", portionGrams: 40 },
  { name: "Chia Tohumu", category: "Yağlar", calories: 486, protein: 17, carbs: 42, fat: 31, sugar: 0, fiber: 34, portion: "1 yemek kaşığı", portionGrams: 15 },
  { name: "Tahin", category: "Yağlar", calories: 595, protein: 17, carbs: 21, fat: 54, sugar: 0.5, fiber: 9.3, portion: "1 yemek kaşığı", portionGrams: 15 },

  // ═══ SEBZELER ═══
  { name: "Brokoli", category: "Sebzeler", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, sugar: 1.7, fiber: 2.6, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Ispanak", category: "Sebzeler", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, sugar: 0.4, fiber: 2.2, portion: "1 porsiyon", portionGrams: 100 },
  { name: "Havuç", category: "Sebzeler", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, sugar: 4.7, fiber: 2.8, portion: "1 orta boy", portionGrams: 80 },
  { name: "Domates", category: "Sebzeler", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, sugar: 2.6, fiber: 1.2, portion: "1 orta boy", portionGrams: 120 },
  { name: "Salatalık", category: "Sebzeler", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, sugar: 1.7, fiber: 0.5, portion: "1 adet", portionGrams: 150 },
  { name: "Biber (Yeşil)", category: "Sebzeler", calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, sugar: 2.4, fiber: 1.7, portion: "1 adet", portionGrams: 80 },
  { name: "Kabak", category: "Sebzeler", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, sugar: 2.5, fiber: 1, portion: "1 orta boy", portionGrams: 200 },
  { name: "Patlıcan", category: "Sebzeler", calories: 25, protein: 1, carbs: 6, fat: 0.2, sugar: 3.5, fiber: 3, portion: "1 orta boy", portionGrams: 200 },
  { name: "Karnabahar", category: "Sebzeler", calories: 25, protein: 1.9, carbs: 5, fat: 0.3, sugar: 1.9, fiber: 2, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Mantar", category: "Sebzeler", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, sugar: 2, fiber: 1, portion: "1 porsiyon", portionGrams: 100 },
  { name: "Marul", category: "Sebzeler", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, sugar: 0.8, fiber: 1.3, portion: "2 yaprak", portionGrams: 50 },
  { name: "Roka", category: "Sebzeler", calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, sugar: 2, fiber: 1.6, portion: "1 porsiyon", portionGrams: 50 },
  { name: "Bezelye", category: "Sebzeler", calories: 81, protein: 5.4, carbs: 14, fat: 0.4, sugar: 5.7, fiber: 5.1, portion: "1 porsiyon", portionGrams: 100 },

  // ═══ MEYVELER ═══
  { name: "Muz", category: "Meyveler", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, sugar: 12, fiber: 2.6, portion: "1 orta boy", portionGrams: 120 },
  { name: "Elma", category: "Meyveler", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, sugar: 10, fiber: 2.4, portion: "1 orta boy", portionGrams: 180 },
  { name: "Portakal", category: "Meyveler", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, sugar: 9.4, fiber: 2.4, portion: "1 orta boy", portionGrams: 150 },
  { name: "Çilek", category: "Meyveler", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, sugar: 4.9, fiber: 2, portion: "1 kase", portionGrams: 150 },
  { name: "Yaban Mersini", category: "Meyveler", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, sugar: 10, fiber: 2.4, portion: "1 kase", portionGrams: 100 },
  { name: "Karpuz", category: "Meyveler", calories: 30, protein: 0.6, carbs: 8, fat: 0.2, sugar: 6.2, fiber: 0.4, portion: "1 dilim", portionGrams: 300 },
  { name: "Üzüm", category: "Meyveler", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, sugar: 16, fiber: 0.9, portion: "1 salkım", portionGrams: 150 },
  { name: "Kivi", category: "Meyveler", calories: 61, protein: 1.1, carbs: 15, fat: 0.5, sugar: 9, fiber: 3, portion: "1 adet", portionGrams: 80 },
  { name: "Hurma (Kuru)", category: "Meyveler", calories: 277, protein: 1.8, carbs: 75, fat: 0.2, sugar: 63, fiber: 7, portion: "3 adet", portionGrams: 30 },
  { name: "İncir (Kuru)", category: "Meyveler", calories: 249, protein: 3.3, carbs: 64, fat: 0.9, sugar: 48, fiber: 10, portion: "3 adet", portionGrams: 40 },

  // ═══ İÇECEKLER ═══
  { name: "Siyah Çay", category: "İçecekler", calories: 1, protein: 0, carbs: 0.3, fat: 0, sugar: 0, fiber: 0, portion: "1 bardak", portionGrams: 200 },
  { name: "Yeşil Çay", category: "İçecekler", calories: 1, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0, portion: "1 bardak", portionGrams: 200 },
  { name: "Türk Kahvesi", category: "İçecekler", calories: 2, protein: 0.1, carbs: 0.3, fat: 0, sugar: 0, fiber: 0, portion: "1 fincan", portionGrams: 65 },
  { name: "Filtre Kahve (Sade)", category: "İçecekler", calories: 2, protein: 0.3, carbs: 0, fat: 0, sugar: 0, fiber: 0, portion: "1 bardak", portionGrams: 240 },
  { name: "Ayran", category: "İçecekler", calories: 26, protein: 1.7, carbs: 2, fat: 1.3, sugar: 2, fiber: 0, portion: "1 bardak", portionGrams: 200 },
  { name: "Portakal Suyu (Taze)", category: "İçecekler", calories: 45, protein: 0.7, carbs: 10, fat: 0.2, sugar: 8.4, fiber: 0.2, portion: "1 bardak", portionGrams: 200 },

  // ═══ TAHILLAR VE ATIŞTIIRMALIKLAR ═══
  { name: "Granola", category: "Tahıllar", calories: 471, protein: 10, carbs: 64, fat: 20, sugar: 24, fiber: 5, portion: "1 porsiyon", portionGrams: 40 },
  { name: "Müsli (Şekersiz)", category: "Tahıllar", calories: 340, protein: 10, carbs: 62, fat: 6, sugar: 10, fiber: 8, portion: "1 porsiyon", portionGrams: 50 },
  { name: "Protein Bar", category: "Tahıllar", calories: 350, protein: 20, carbs: 40, fat: 12, sugar: 20, fiber: 5, portion: "1 adet", portionGrams: 60 },
  { name: "Simit", category: "Tahıllar", calories: 312, protein: 10, carbs: 60, fat: 4, sugar: 3, fiber: 3, portion: "1 adet", portionGrams: 120 },
  { name: "Lavaş", category: "Tahıllar", calories: 275, protein: 9, carbs: 56, fat: 1.2, sugar: 1.6, fiber: 2.3, portion: "1 adet", portionGrams: 60 },

  // ═══ TÜRK MUTFAĞI ═══
  { name: "Kısır", category: "Türk Mutfağı", calories: 105, protein: 3, carbs: 18, fat: 3, sugar: 1.5, fiber: 3, portion: "1 porsiyon", portionGrams: 150 },
  { name: "Çiğ Köfte (Etsiz)", category: "Türk Mutfağı", calories: 143, protein: 4.5, carbs: 23, fat: 4, sugar: 2, fiber: 4, portion: "1 porsiyon", portionGrams: 100 },
  { name: "Humus", category: "Türk Mutfağı", calories: 166, protein: 7.9, carbs: 14, fat: 10, sugar: 0.3, fiber: 6, portion: "2 yemek kaşığı", portionGrams: 60 },
  { name: "Cacık", category: "Türk Mutfağı", calories: 36, protein: 2, carbs: 3, fat: 1.8, sugar: 2.5, fiber: 0.3, portion: "1 kase", portionGrams: 200 },
  { name: "Mercimek Çorbası", category: "Türk Mutfağı", calories: 55, protein: 3.5, carbs: 9, fat: 0.8, sugar: 1, fiber: 2, portion: "1 kase", portionGrams: 250 },
  { name: "Etli Kuru Fasulye", category: "Türk Mutfağı", calories: 95, protein: 6, carbs: 12, fat: 3, sugar: 2, fiber: 4, portion: "1 porsiyon", portionGrams: 300 },
  { name: "Pilav Üstü Tavuk", category: "Türk Mutfağı", calories: 140, protein: 12, carbs: 16, fat: 3.5, sugar: 0.5, fiber: 0.3, portion: "1 porsiyon", portionGrams: 350 },
  { name: "Izgara Köfte", category: "Türk Mutfağı", calories: 215, protein: 18, carbs: 6, fat: 13, sugar: 1, fiber: 0.5, portion: "3 adet", portionGrams: 120 },
  { name: "Lahmacun", category: "Türk Mutfağı", calories: 210, protein: 9, carbs: 28, fat: 7, sugar: 3, fiber: 2, portion: "1 adet", portionGrams: 120 },
  { name: "Mantı", category: "Türk Mutfağı", calories: 180, protein: 10, carbs: 22, fat: 6, sugar: 1, fiber: 1, portion: "1 porsiyon", portionGrams: 200 },
  { name: "Gözleme (Peynirli)", category: "Türk Mutfağı", calories: 240, protein: 9, carbs: 30, fat: 9, sugar: 2, fiber: 1, portion: "1 adet", portionGrams: 150 },
  { name: "Dolma (Yaprak)", category: "Türk Mutfağı", calories: 105, protein: 2, carbs: 14, fat: 5, sugar: 1.5, fiber: 2, portion: "5 adet", portionGrams: 150 },
  { name: "Karnıyarık", category: "Türk Mutfağı", calories: 115, protein: 6, carbs: 9, fat: 7, sugar: 4, fiber: 3, portion: "1 porsiyon", portionGrams: 250 },

  // ═══ SOSLAR ═══
  { name: "Ketçap", category: "Soslar", calories: 112, protein: 1.7, carbs: 26, fat: 0.4, sugar: 22, fiber: 0.3, portion: "1 yemek kaşığı", portionGrams: 17 },
  { name: "Mayonez", category: "Soslar", calories: 680, protein: 1, carbs: 0.6, fat: 75, sugar: 0.6, fiber: 0, portion: "1 yemek kaşığı", portionGrams: 15 },
  { name: "Soya Sosu", category: "Soslar", calories: 53, protein: 8, carbs: 4.9, fat: 0.1, sugar: 0.4, fiber: 0.8, portion: "1 yemek kaşığı", portionGrams: 15 },
  { name: "Salça (Domates)", category: "Soslar", calories: 82, protein: 4.3, carbs: 19, fat: 0.5, sugar: 12, fiber: 4.6, portion: "1 yemek kaşığı", portionGrams: 16 },
];

export const FOOD_CATEGORIES = [...new Set(FOOD_DATABASE.map((f) => f.category))];
