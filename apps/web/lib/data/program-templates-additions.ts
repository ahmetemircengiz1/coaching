// ═══════════════════════════════════════════════════════════════════════
//  YENİ PROGRAM ŞABLONLARI — Ek Paket
//  Kaynak: Dünyaca tanınan programlar, bilimsel ve topluluk destekli
//
//  KULLANIM:
//  program-templates.ts dosyasındaki PROGRAM_TEMPLATES dizisine
//  aşağıdaki sabiti spread operatörü ile ekleyin:
//
//  export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
//    beginnerFullBody,
//    intermediateUpperLower,
//    advancedPPL,
//    ...ADDITIONAL_PROGRAM_TEMPLATES,   // ← bu satırı ekleyin
//  ];
// ═══════════════════════════════════════════════════════════════════════

import type { ProgramTemplate } from "./program-templates";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. STRONGLİFTS 5×5
//    Kaynak: stronglifts.com (Mehdi Hadim)
//    Seviye: Başlangıç | Hedef: Güç
//    3 gün/hafta — 12 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const stronglifts5x5: ProgramTemplate = {
  id: "stronglifts-5x5",
  name: "StrongLifts 5×5 (3 Gün)",
  description:
    "Mehdi Hadim'in dünyaca ünlü başlangıç güç programı. A/B antrenmanı dönüşümlü olarak haftada 3 gün yapılır. Her seansta ağırlık artırılır. Kaynak: stronglifts.com",
  level: "beginner",
  weeks: 12,
  daysPerWeek: 3,
  goal: "Temel güç inşası ve barbell tekniği",
  template: Array.from({ length: 12 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi — Antrenman A
        name: "Antrenman A",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 5, reps: "5", restSeconds: 180 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 5, reps: "5", restSeconds: 180 },
          { exerciseName: "Barbell Row", sets: 5, reps: "5", restSeconds: 180 },
        ],
      },
      {
        dayOfWeek: 3, // Çarşamba — Antrenman B
        name: "Antrenman B",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 5, reps: "5", restSeconds: 180 },
          { exerciseName: "Overhead Press (Military)", sets: 5, reps: "5", restSeconds: 180 },
          { exerciseName: "Deadlift", sets: 1, reps: "5", restSeconds: 300 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma — Antrenman A (dönüşümlü)
        name: "Antrenman A (Dönüşüm)",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 5, reps: "5", restSeconds: 180 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 5, reps: "5", restSeconds: 180 },
          { exerciseName: "Barbell Row", sets: 5, reps: "5", restSeconds: 180 },
        ],
      },
    ],
  })),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. ARNOLD GOLDEN SIX
//    Kaynak: Arnold Schwarzenegger — "The Education of a Bodybuilder"
//    Seviye: Başlangıç/Orta | Hedef: Genel Güç & Kas
//    3 gün/hafta — 8 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const arnoldGoldenSix: ProgramTemplate = {
  id: "arnold-golden-six",
  name: "Arnold Golden Six (3 Gün)",
  description:
    "Arnold Schwarzenegger'ın yeni başlayanlara önerdiği efsanevi 6 hareketli full-body programı. 'The Education of a Bodybuilder' kitabında tanıtılmıştır. Haftada 3 gün, aynı program tekrar edilir.",
  level: "beginner",
  weeks: 8,
  daysPerWeek: 3,
  goal: "Genel güç, kas kütlesi ve kondisyon",
  template: Array.from({ length: 8 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi
        name: "Golden Six",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "10", restSeconds: 120 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "Maksimum", restSeconds: 120 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "10", restSeconds: 90 },
          { exerciseName: "Overhead Press (Military)", sets: 4, reps: "10", restSeconds: 90 },
          { exerciseName: "Barbell Curl", sets: 3, reps: "10", restSeconds: 60 },
          { exerciseName: "Crunch", sets: 3, reps: "Maksimum", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 3, // Çarşamba
        name: "Golden Six",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "10", restSeconds: 120 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "Maksimum", restSeconds: 120 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "10", restSeconds: 90 },
          { exerciseName: "Overhead Press (Military)", sets: 4, reps: "10", restSeconds: 90 },
          { exerciseName: "Barbell Curl", sets: 3, reps: "10", restSeconds: 60 },
          { exerciseName: "Crunch", sets: 3, reps: "Maksimum", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma
        name: "Golden Six",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "10", restSeconds: 120 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "Maksimum", restSeconds: 120 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "10", restSeconds: 90 },
          { exerciseName: "Overhead Press (Military)", sets: 4, reps: "10", restSeconds: 90 },
          { exerciseName: "Barbell Curl", sets: 3, reps: "10", restSeconds: 60 },
          { exerciseName: "Crunch", sets: 3, reps: "Maksimum", restSeconds: 60 },
        ],
      },
    ],
  })),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. EKİPMANSIZ BAŞLANGIÇ (Calisthenics)
//    Kaynak: r/bodyweightfitness wiki + genel egzersiz bilimi
//    Seviye: Başlangıç | Hedef: Genel Kondisyon (Evde/Parkta)
//    3 gün/hafta — 8 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const bodyweightBeginner: ProgramTemplate = {
  id: "bodyweight-beginner",
  name: "Ekipmansız Başlangıç (3 Gün)",
  description:
    "Alet gerekmeden evde veya parkta uygulanabilen başlangıç seviyesi tam vücut programı. r/bodyweightfitness topluluğunun önerdiği temel hareketlerden oluşur.",
  level: "beginner",
  weeks: 8,
  daysPerWeek: 3,
  goal: "Genel kondisyon, vücut kontrolü, temel güç",
  template: Array.from({ length: 8 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi
        name: "Full Body Vücut Ağırlığı A",
        exercises: [
          { exerciseName: "Squat (Vücut Ağırlığı)", sets: 3, reps: "15-20", restSeconds: 60 },
          { exerciseName: "Push-Up (Şınav)", sets: 3, reps: "8-15", restSeconds: 60 },
          { exerciseName: "Chin-Up (Ters Tutuş Barfiks)", sets: 3, reps: "3-8", restSeconds: 90 },
          { exerciseName: "Reverse Lunge", sets: 3, reps: "10-12 (her bacak)", restSeconds: 60 },
          { exerciseName: "Dip (Paralel Bar)", sets: 3, reps: "5-10", restSeconds: 60 },
          { exerciseName: "Plank", sets: 3, reps: "30-60 sn", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 3, // Çarşamba
        name: "Full Body Vücut Ağırlığı B",
        exercises: [
          { exerciseName: "Jump Squat", sets: 3, reps: "10", restSeconds: 60 },
          { exerciseName: "Pike Push-Up", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "3-8", restSeconds: 90 },
          { exerciseName: "Bulgarian Split Squat (Vücut Ağırlığı)", sets: 3, reps: "10 (her bacak)", restSeconds: 60 },
          { exerciseName: "Dip (Paralel Bar)", sets: 3, reps: "5-10", restSeconds: 60 },
          { exerciseName: "Hanging Leg Raise", sets: 3, reps: "8-12", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma
        name: "Full Body Vücut Ağırlığı C",
        exercises: [
          { exerciseName: "Squat (Vücut Ağırlığı)", sets: 4, reps: "20", restSeconds: 45 },
          { exerciseName: "Push-Up (Şınav)", sets: 4, reps: "Maksimum", restSeconds: 60 },
          { exerciseName: "Chin-Up (Ters Tutuş Barfiks)", sets: 4, reps: "Maksimum", restSeconds: 90 },
          { exerciseName: "Burpee", sets: 3, reps: "10", restSeconds: 60 },
          { exerciseName: "Mountain Climber", sets: 3, reps: "30 sn", restSeconds: 45 },
          { exerciseName: "Plank", sets: 3, reps: "45-60 sn", restSeconds: 45 },
        ],
      },
    ],
  })),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. TEXAS METHOD
//    Kaynak: Mark Rippetoe / barbell-logic.com / startingstrength.com
//    Seviye: Orta | Hedef: Güç & Haftalık PR
//    3 gün/hafta — 12 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const texasMethod: ProgramTemplate = {
  id: "texas-method",
  name: "Texas Method (3 Gün)",
  description:
    "Mark Rippetoe tarafından popularize edilen ara seviye güç programı. Haftalık döngü: Pazartesi hacim günü (5x5), Çarşamba iyileşme günü, Cuma yoğunluk günü (yeni PR). Kaynak: startingstrength.com, barbell-logic.com",
  level: "intermediate",
  weeks: 12,
  daysPerWeek: 3,
  goal: "Haftalık güç PR'ı ve kuvvet gelişimi",
  template: Array.from({ length: 12 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi — Hacim Günü
        name: "Hacim Günü (Volume)",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 5, reps: "5", restSeconds: 180 },
          // Bench ve OHP haftalar arasında dönüşümlü kullanılır
          ...(w % 2 === 0
            ? [{ exerciseName: "Bench Press (Düz Bank)", sets: 5, reps: "5", restSeconds: 150 }]
            : [{ exerciseName: "Overhead Press (Military)", sets: 5, reps: "5", restSeconds: 150 }]),
          { exerciseName: "Deadlift", sets: 1, reps: "5", restSeconds: 300 },
        ],
      },
      {
        dayOfWeek: 3, // Çarşamba — İyileşme Günü
        name: "İyileşme Günü (Recovery)",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 2, reps: "5 (Pazartesi ağırlığının %80'i)", restSeconds: 150 },
          ...(w % 2 === 0
            ? [{ exerciseName: "Overhead Press (Military)", sets: 3, reps: "5", restSeconds: 120 }]
            : [{ exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "5", restSeconds: 120 }]),
          { exerciseName: "Chin-Up (Ters Tutuş Barfiks)", sets: 3, reps: "Maksimum", restSeconds: 90 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma — Yoğunluk Günü (PR)
        name: "Yoğunluk Günü (Intensity — PR)",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 1, reps: "5 (Yeni PR)", restSeconds: 300 },
          ...(w % 2 === 0
            ? [{ exerciseName: "Bench Press (Düz Bank)", sets: 1, reps: "5 (Yeni PR)", restSeconds: 240 }]
            : [{ exerciseName: "Overhead Press (Military)", sets: 1, reps: "5 (Yeni PR)", restSeconds: 240 }]),
          { exerciseName: "Deadlift", sets: 1, reps: "3 (Yeni PR)", restSeconds: 300 },
          { exerciseName: "Barbell Row", sets: 3, reps: "5", restSeconds: 120 },
        ],
      },
    ],
  })),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. 5/3/1 BORING BUT BIG (BBB)
//    Kaynak: Jim Wendler — jimwendler.com / "5/3/1 Forever"
//    Seviye: Orta | Hedef: Güç + Kas Kütlesi
//    4 gün/hafta — 4 haftalık döngü × 2 (8 hafta)
//    Not: Her 4 haftada 1 deload haftası dahildir
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const fiveThreeOneBBB: ProgramTemplate = {
  id: "531-bbb",
  name: "5/3/1 Boring But Big (4 Gün)",
  description:
    "Jim Wendler'ın efsanevi 5/3/1 programının en popüler varyantı. Ana hareket için 5/3/1 yükleme şeması + aynı hareketi 5×10 ile tekrar (BBB). 4 haftada 1 deload. Kaynak: jimwendler.com",
  level: "intermediate",
  weeks: 8,
  daysPerWeek: 4,
  goal: "Maksimum güç + kas hacmi kombinasyonu",
  template: [
    // ─── Döngü 1 ───
    // Hafta 1: 5s Haftası (65/75/85%)
    {
      weekNumber: 1,
      workouts: [
        {
          dayOfWeek: 1, // Pazartesi — OHP Günü
          name: "Omuz Günü (5s)",
          exercises: [
            { exerciseName: "Overhead Press (Military)", sets: 3, reps: "5-5-5+", restSeconds: 180 },
            { exerciseName: "Overhead Press (Military)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 90 },
            { exerciseName: "Pull-Up (Barfiks)", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Dumbbell Curl", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Skull Crusher", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 2, // Salı — Deadlift Günü
          name: "Deadlift Günü (5s)",
          exercises: [
            { exerciseName: "Deadlift", sets: 3, reps: "5-5-5+", restSeconds: 240 },
            { exerciseName: "Deadlift", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 120 },
            { exerciseName: "Barbell Row", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Barbell Curl", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Hanging Leg Raise", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 4, // Perşembe — Bench Günü
          name: "Göğüs Günü (5s)",
          exercises: [
            { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "5-5-5+", restSeconds: 180 },
            { exerciseName: "Bench Press (Düz Bank)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 90 },
            { exerciseName: "Dumbbell Row", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Hammer Curl", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 5, // Cuma — Squat Günü
          name: "Bacak Günü (5s)",
          exercises: [
            { exerciseName: "Squat (Barbell)", sets: 3, reps: "5-5-5+", restSeconds: 240 },
            { exerciseName: "Squat (Barbell)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 120 },
            { exerciseName: "Leg Curl (Yatarak)", sets: 5, reps: "10", restSeconds: 60 },
            { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "12", restSeconds: 60 },
            { exerciseName: "Plank", sets: 3, reps: "45-60 sn", restSeconds: 45 },
          ],
        },
      ],
    },
    // Hafta 2: 3s Haftası (70/80/90%)
    {
      weekNumber: 2,
      workouts: [
        {
          dayOfWeek: 1,
          name: "Omuz Günü (3s)",
          exercises: [
            { exerciseName: "Overhead Press (Military)", sets: 3, reps: "3-3-3+", restSeconds: 180 },
            { exerciseName: "Overhead Press (Military)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 90 },
            { exerciseName: "Pull-Up (Barfiks)", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Dumbbell Curl", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Skull Crusher", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 2,
          name: "Deadlift Günü (3s)",
          exercises: [
            { exerciseName: "Deadlift", sets: 3, reps: "3-3-3+", restSeconds: 240 },
            { exerciseName: "Deadlift", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 120 },
            { exerciseName: "Barbell Row", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Barbell Curl", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Hanging Leg Raise", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 4,
          name: "Göğüs Günü (3s)",
          exercises: [
            { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "3-3-3+", restSeconds: 180 },
            { exerciseName: "Bench Press (Düz Bank)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 90 },
            { exerciseName: "Dumbbell Row", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Hammer Curl", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 5,
          name: "Bacak Günü (3s)",
          exercises: [
            { exerciseName: "Squat (Barbell)", sets: 3, reps: "3-3-3+", restSeconds: 240 },
            { exerciseName: "Squat (Barbell)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 120 },
            { exerciseName: "Leg Curl (Yatarak)", sets: 5, reps: "10", restSeconds: 60 },
            { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "12", restSeconds: 60 },
            { exerciseName: "Plank", sets: 3, reps: "45-60 sn", restSeconds: 45 },
          ],
        },
      ],
    },
    // Hafta 3: 1+ Haftası (75/85/95%)
    {
      weekNumber: 3,
      workouts: [
        {
          dayOfWeek: 1,
          name: "Omuz Günü (1+)",
          exercises: [
            { exerciseName: "Overhead Press (Military)", sets: 3, reps: "5-3-1+", restSeconds: 240 },
            { exerciseName: "Overhead Press (Military)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 90 },
            { exerciseName: "Pull-Up (Barfiks)", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Dumbbell Curl", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Skull Crusher", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 2,
          name: "Deadlift Günü (1+)",
          exercises: [
            { exerciseName: "Deadlift", sets: 3, reps: "5-3-1+", restSeconds: 300 },
            { exerciseName: "Deadlift", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 120 },
            { exerciseName: "Barbell Row", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Barbell Curl", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Hanging Leg Raise", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 4,
          name: "Göğüs Günü (1+)",
          exercises: [
            { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "5-3-1+", restSeconds: 240 },
            { exerciseName: "Bench Press (Düz Bank)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 90 },
            { exerciseName: "Dumbbell Row", sets: 5, reps: "10", restSeconds: 90 },
            { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "10-15", restSeconds: 60 },
            { exerciseName: "Hammer Curl", sets: 3, reps: "10-15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 5,
          name: "Bacak Günü (1+)",
          exercises: [
            { exerciseName: "Squat (Barbell)", sets: 3, reps: "5-3-1+", restSeconds: 300 },
            { exerciseName: "Squat (Barbell)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 120 },
            { exerciseName: "Leg Curl (Yatarak)", sets: 5, reps: "10", restSeconds: 60 },
            { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "12", restSeconds: 60 },
            { exerciseName: "Plank", sets: 3, reps: "45-60 sn", restSeconds: 45 },
          ],
        },
      ],
    },
    // Hafta 4: Deload (40/50/60%)
    {
      weekNumber: 4,
      workouts: [
        {
          dayOfWeek: 1,
          name: "Omuz Günü (Deload)",
          exercises: [
            { exerciseName: "Overhead Press (Military)", sets: 3, reps: "5 (Hafif — Deload)", restSeconds: 120 },
            { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "10", restSeconds: 90 },
            { exerciseName: "Dumbbell Curl", sets: 2, reps: "15", restSeconds: 60 },
          ],
        },
        {
          dayOfWeek: 2,
          name: "Deadlift Günü (Deload)",
          exercises: [
            { exerciseName: "Deadlift", sets: 3, reps: "5 (Hafif — Deload)", restSeconds: 180 },
            { exerciseName: "Barbell Row", sets: 3, reps: "10", restSeconds: 90 },
          ],
        },
        {
          dayOfWeek: 4,
          name: "Göğüs Günü (Deload)",
          exercises: [
            { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "5 (Hafif — Deload)", restSeconds: 120 },
            { exerciseName: "Dumbbell Row", sets: 3, reps: "10", restSeconds: 90 },
          ],
        },
        {
          dayOfWeek: 5,
          name: "Bacak Günü (Deload)",
          exercises: [
            { exerciseName: "Squat (Barbell)", sets: 3, reps: "5 (Hafif — Deload)", restSeconds: 180 },
            { exerciseName: "Romanian Deadlift (RDL)", sets: 3, reps: "10", restSeconds: 90 },
          ],
        },
      ],
    },
    // ─── Döngü 2 (Hafta 5-8) — aynı yapı, ağırlık artar ───
    ...["5s", "3s", "1+", "Deload"].map((label, wi) => ({
      weekNumber: wi + 5,
      workouts: [
        {
          dayOfWeek: 1,
          name: `Omuz Günü (${label}) — Döngü 2`,
          exercises: [
            {
              exerciseName: "Overhead Press (Military)",
              sets: label === "Deload" ? 3 : 3,
              reps: label === "5s" ? "5-5-5+" : label === "3s" ? "3-3-3+" : label === "1+" ? "5-3-1+" : "5 (Hafif)",
              restSeconds: label === "Deload" ? 120 : 180,
            },
            ...(label !== "Deload"
              ? [
                  { exerciseName: "Overhead Press (Military)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 90 },
                  { exerciseName: "Pull-Up (Barfiks)", sets: 5, reps: "10", restSeconds: 90 },
                  { exerciseName: "Dumbbell Curl", sets: 3, reps: "10-15", restSeconds: 60 },
                  { exerciseName: "Skull Crusher", sets: 3, reps: "10-15", restSeconds: 60 },
                ]
              : [{ exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "10", restSeconds: 90 }]),
          ],
        },
        {
          dayOfWeek: 2,
          name: `Deadlift Günü (${label}) — Döngü 2`,
          exercises: [
            {
              exerciseName: "Deadlift",
              sets: 3,
              reps: label === "5s" ? "5-5-5+" : label === "3s" ? "3-3-3+" : label === "1+" ? "5-3-1+" : "5 (Hafif)",
              restSeconds: label === "Deload" ? 180 : 240,
            },
            ...(label !== "Deload"
              ? [
                  { exerciseName: "Deadlift", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 120 },
                  { exerciseName: "Barbell Row", sets: 5, reps: "10", restSeconds: 90 },
                  { exerciseName: "Barbell Curl", sets: 3, reps: "10-15", restSeconds: 60 },
                  { exerciseName: "Hanging Leg Raise", sets: 3, reps: "10-15", restSeconds: 60 },
                ]
              : [{ exerciseName: "Barbell Row", sets: 3, reps: "10", restSeconds: 90 }]),
          ],
        },
        {
          dayOfWeek: 4,
          name: `Göğüs Günü (${label}) — Döngü 2`,
          exercises: [
            {
              exerciseName: "Bench Press (Düz Bank)",
              sets: 3,
              reps: label === "5s" ? "5-5-5+" : label === "3s" ? "3-3-3+" : label === "1+" ? "5-3-1+" : "5 (Hafif)",
              restSeconds: label === "Deload" ? 120 : 180,
            },
            ...(label !== "Deload"
              ? [
                  { exerciseName: "Bench Press (Düz Bank)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 90 },
                  { exerciseName: "Dumbbell Row", sets: 5, reps: "10", restSeconds: 90 },
                  { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "10-15", restSeconds: 60 },
                  { exerciseName: "Hammer Curl", sets: 3, reps: "10-15", restSeconds: 60 },
                ]
              : [{ exerciseName: "Dumbbell Row", sets: 3, reps: "10", restSeconds: 90 }]),
          ],
        },
        {
          dayOfWeek: 5,
          name: `Bacak Günü (${label}) — Döngü 2`,
          exercises: [
            {
              exerciseName: "Squat (Barbell)",
              sets: 3,
              reps: label === "5s" ? "5-5-5+" : label === "3s" ? "3-3-3+" : label === "1+" ? "5-3-1+" : "5 (Hafif)",
              restSeconds: label === "Deload" ? 180 : 240,
            },
            ...(label !== "Deload"
              ? [
                  { exerciseName: "Squat (Barbell)", sets: 5, reps: "10 (BBB ~50%)", restSeconds: 120 },
                  { exerciseName: "Leg Curl (Yatarak)", sets: 5, reps: "10", restSeconds: 60 },
                  { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "12", restSeconds: 60 },
                  { exerciseName: "Plank", sets: 3, reps: "45-60 sn", restSeconds: 45 },
                ]
              : [{ exerciseName: "Romanian Deadlift (RDL)", sets: 3, reps: "10", restSeconds: 90 }]),
          ],
        },
      ],
    })),
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. PHUL — Power Hypertrophy Upper Lower
//    Kaynak: Brandon Campbell / muscleandstrength.com
//    Seviye: Orta | Hedef: Güç + Kas Kütlesi
//    4 gün/hafta — 12 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const phul: ProgramTemplate = {
  id: "phul",
  name: "PHUL — Power Hypertrophy Upper/Lower (4 Gün)",
  description:
    "Brandon Campbell tarafından geliştirilen güç + hipertrofi kombinasyonlu program. Haftada 2 güç günü (düşük tekrar) + 2 hipertrofi günü (orta tekrar). Kaynak: muscleandstrength.com, boostcamp.app",
  level: "intermediate",
  weeks: 12,
  daysPerWeek: 4,
  goal: "Güç + kas kütlesi dengeli gelişim",
  template: Array.from({ length: 12 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi — Üst Vücut Güç
        name: "Üst Vücut Güç (Power)",
        exercises: [
          { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "3-5", restSeconds: 180 },
          { exerciseName: "Barbell Row", sets: 3, reps: "3-5", restSeconds: 180 },
          { exerciseName: "İncline Dumbbell Press", sets: 3, reps: "6-10", restSeconds: 120 },
          { exerciseName: "Lat Pulldown", sets: 3, reps: "6-10", restSeconds: 120 },
          { exerciseName: "Overhead Press (Military)", sets: 2, reps: "6-10", restSeconds: 90 },
          { exerciseName: "Seated Cable Row", sets: 2, reps: "6-10", restSeconds: 90 },
          { exerciseName: "Barbell Curl", sets: 3, reps: "6-10", restSeconds: 60 },
          { exerciseName: "Skull Crusher", sets: 3, reps: "6-10", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 2, // Salı — Alt Vücut Güç
        name: "Alt Vücut Güç (Power)",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 3, reps: "3-5", restSeconds: 240 },
          { exerciseName: "Deadlift", sets: 3, reps: "3-5", restSeconds: 240 },
          { exerciseName: "Leg Press", sets: 3, reps: "10-15", restSeconds: 90 },
          { exerciseName: "Leg Curl (Yatarak)", sets: 3, reps: "10-15", restSeconds: 90 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "8-12", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 4, // Perşembe — Üst Vücut Hipertrofi
        name: "Üst Vücut Hipertrofi",
        exercises: [
          { exerciseName: "İncline Dumbbell Press", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Cable Crossover", sets: 4, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Seated Cable Row", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Rear Delt Fly", sets: 4, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Dumbbell Shoulder Press", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Cable Lateral Raise", sets: 3, reps: "8-12", restSeconds: 45 },
          { exerciseName: "EZ Bar Curl", sets: 3, reps: "8-12", restSeconds: 45 },
          { exerciseName: "Rope Pushdown", sets: 3, reps: "8-12", restSeconds: 45 },
          { exerciseName: "Hammer Curl", sets: 2, reps: "8-12", restSeconds: 45 },
          { exerciseName: "Overhead Triceps Extension", sets: 2, reps: "8-12", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma — Alt Vücut Hipertrofi
        name: "Alt Vücut Hipertrofi",
        exercises: [
          { exerciseName: "Front Squat", sets: 4, reps: "8-12", restSeconds: 120 },
          { exerciseName: "Hack Squat", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Leg Extension", sets: 4, reps: "10-15", restSeconds: 60 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Seated Leg Curl", sets: 4, reps: "10-15", restSeconds: 60 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 4, reps: "10-15", restSeconds: 60 },
          { exerciseName: "Seated Calf Raise", sets: 4, reps: "10-15", restSeconds: 45 },
        ],
      },
    ],
  })),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. REDDİT PPL (Metallicadpa)
//    Kaynak: r/fitness topluluk wiki / thefitness.wiki
//    Seviye: Orta | Hedef: Kas & Güç
//    6 gün/hafta — 8 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const redditPPL: ProgramTemplate = {
  id: "reddit-ppl",
  name: "Reddit PPL — Metallicadpa (6 Gün)",
  description:
    "r/fitness topluluğunun en popüler 6 günlük Push/Pull/Legs programı. Doğrusal ilerleme prensibine dayalıdır. A/B varyasyonu ile kas grupları haftada 2 kez çalışılır. Kaynak: thefitness.wiki, liftvault.com",
  level: "intermediate",
  weeks: 8,
  daysPerWeek: 6,
  goal: "Kas kütlesi ve güç dengeli gelişim",
  template: Array.from({ length: 8 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi — Push A
        name: "Push A (Göğüs Odaklı)",
        exercises: [
          { exerciseName: "Bench Press (Düz Bank)", sets: 4, reps: "5 / 5 / 5 / 5+", restSeconds: 150 },
          { exerciseName: "Overhead Press (Military)", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "İncline Dumbbell Press", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Rope Pushdown", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Lateral Raise", sets: 3, reps: "15-20", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 2, // Salı — Pull A
        name: "Pull A (Sırt Odaklı)",
        exercises: [
          { exerciseName: "Deadlift", sets: 4, reps: "5 / 5 / 5 / 5+", restSeconds: 240 },
          { exerciseName: "Barbell Row", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Lat Pulldown", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Seated Cable Row", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Cable Face Pull", sets: 5, reps: "15-20", restSeconds: 45 },
          { exerciseName: "Hammer Curl", sets: 4, reps: "8-12", restSeconds: 45 },
          { exerciseName: "Dumbbell Curl", sets: 4, reps: "8-12", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 3, // Çarşamba — Legs A
        name: "Legs A (Quadriceps Odaklı)",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "5 / 5 / 5 / 5+", restSeconds: 240 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Leg Press", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Leg Curl (Yatarak)", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "8-12", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 4, // Perşembe — Push B
        name: "Push B (Omuz Odaklı)",
        exercises: [
          { exerciseName: "Overhead Press (Military)", sets: 4, reps: "5 / 5 / 5 / 5+", restSeconds: 150 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "İncline Dumbbell Press", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Rope Pushdown", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Lateral Raise", sets: 3, reps: "15-20", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma — Pull B
        name: "Pull B (Genişlik Odaklı)",
        exercises: [
          { exerciseName: "Barbell Row", sets: 4, reps: "5 / 5 / 5 / 5+", restSeconds: 150 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Lat Pulldown", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Seated Cable Row", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Cable Face Pull", sets: 5, reps: "15-20", restSeconds: 45 },
          { exerciseName: "Hammer Curl", sets: 4, reps: "8-12", restSeconds: 45 },
          { exerciseName: "EZ Bar Curl", sets: 4, reps: "8-12", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 6, // Cumartesi — Legs B
        name: "Legs B (Hamstring/Kalça Odaklı)",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "5 / 5 / 5 / 5+", restSeconds: 240 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Leg Press", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Hip Thrust", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Seated Leg Curl", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "8-12", restSeconds: 60 },
        ],
      },
    ],
  })),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. PHAT — Power Hypertrophy Adaptive Training
//    Kaynak: Dr. Layne Norton — biolayne.com
//    Seviye: İleri | Hedef: Güç + Kas Kütlesi
//    5 gün/hafta — 8 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const phat: ProgramTemplate = {
  id: "phat",
  name: "PHAT — Dr. Layne Norton (5 Gün)",
  description:
    "Dr. Layne Norton'ın geliştirdiği güç + hipertrofi adaptasyon programı. Haftada 2 güç günü (3-5 tekrar) + 3 hipertrofi günü (8-20 tekrar). Powerbuilding yaklaşımı. Kaynak: biolayne.com",
  level: "advanced",
  weeks: 8,
  daysPerWeek: 5,
  goal: "Güç ve kas kütlesi eş zamanlı maksimizasyon",
  template: Array.from({ length: 8 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi — Üst Vücut Güç
        name: "Üst Vücut Güç Günü",
        exercises: [
          { exerciseName: "Barbell Row", sets: 3, reps: "3-5", restSeconds: 180 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 2, reps: "6-10", restSeconds: 120 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "3-5", restSeconds: 180 },
          { exerciseName: "Dip (Paralel Bar)", sets: 2, reps: "6-10", restSeconds: 120 },
          { exerciseName: "EZ Bar Curl", sets: 3, reps: "6-10", restSeconds: 60 },
          { exerciseName: "Skull Crusher", sets: 3, reps: "6-10", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 2, // Salı — Alt Vücut Güç
        name: "Alt Vücut Güç Günü",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 3, reps: "3-5", restSeconds: 240 },
          { exerciseName: "Hack Squat", sets: 2, reps: "6-10", restSeconds: 150 },
          { exerciseName: "Leg Extension", sets: 2, reps: "6-10", restSeconds: 90 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 3, reps: "3-5", restSeconds: 240 },
          { exerciseName: "Seated Leg Curl", sets: 2, reps: "6-10", restSeconds: 90 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 3, reps: "6-10", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 4, // Perşembe — Sırt & Omuz Hipertrofi
        name: "Sırt & Omuz Hipertrofi",
        exercises: [
          { exerciseName: "İncline Dumbbell Press", sets: 3, reps: "8-15", restSeconds: 90 },
          { exerciseName: "Barbell Row", sets: 6, reps: "3 (Hız Seti)", restSeconds: 60 },
          { exerciseName: "T-Bar Row", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Seated Cable Row", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Lat Pulldown", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Dumbbell Shoulder Press", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Cable Lateral Raise", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Cable Face Pull", sets: 4, reps: "12-15", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma — Alt Vücut Hipertrofi
        name: "Alt Vücut Hipertrofi",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 6, reps: "3 (Hız Seti)", restSeconds: 60 },
          { exerciseName: "Hack Squat", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Leg Extension", sets: 4, reps: "10-15", restSeconds: 60 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Seated Leg Curl", sets: 4, reps: "10-15", restSeconds: 60 },
          { exerciseName: "Hip Thrust", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 4, reps: "10-15", restSeconds: 60 },
          { exerciseName: "Seated Calf Raise", sets: 4, reps: "10-15", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 6, // Cumartesi — Göğüs & Kol Hipertrofi
        name: "Göğüs & Kol Hipertrofi",
        exercises: [
          { exerciseName: "Bench Press (Düz Bank)", sets: 6, reps: "3 (Hız Seti)", restSeconds: 60 },
          { exerciseName: "İncline Dumbbell Press", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Cable Crossover", sets: 4, reps: "10-15", restSeconds: 60 },
          { exerciseName: "Dip (Paralel Bar)", sets: 3, reps: "8-12", restSeconds: 60 },
          { exerciseName: "EZ Bar Curl", sets: 4, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Preacher Curl", sets: 3, reps: "10-12", restSeconds: 45 },
          { exerciseName: "Hammer Curl", sets: 3, reps: "10-12", restSeconds: 45 },
          { exerciseName: "Skull Crusher", sets: 4, reps: "8-12", restSeconds: 60 },
          { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "10-12", restSeconds: 45 },
          { exerciseName: "Rope Pushdown", sets: 3, reps: "10-15", restSeconds: 45 },
        ],
      },
    ],
  })),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. KLASİK BRO SPLIT — 5 Gün
//    Kaynak: Joe Weider prensipleri / klasik bodybuilding geleneği
//    Seviye: Orta | Hedef: Kas Kütlesi / Estetik
//    5 gün/hafta — 8 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const classicBroSplit: ProgramTemplate = {
  id: "classic-bro-split",
  name: "Klasik Bro Split — 5 Gün",
  description:
    "Her kas grubuna haftada 1 kez yoğun antrenman yapılan klasik bodybuilding split programı. Joe Weider prensiplerinden ilham alınmıştır. Estetik ve kas kütlesi hedefleyenler için.",
  level: "intermediate",
  weeks: 8,
  daysPerWeek: 5,
  goal: "Kas kütlesi ve estetik",
  template: Array.from({ length: 8 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi — Göğüs
        name: "Göğüs Günü",
        exercises: [
          { exerciseName: "Bench Press (Düz Bank)", sets: 4, reps: "6-10", restSeconds: 120 },
          { exerciseName: "İncline Bench Press", sets: 4, reps: "8-12", restSeconds: 90 },
          { exerciseName: "İncline Dumbbell Press", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Cable Crossover", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Dip (Paralel Bar)", sets: 3, reps: "10-15", restSeconds: 60 },
          { exerciseName: "Cable Face Pull", sets: 3, reps: "15-20", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 2, // Salı — Sırt
        name: "Sırt Günü",
        exercises: [
          { exerciseName: "Deadlift", sets: 4, reps: "5-8", restSeconds: 180 },
          { exerciseName: "Barbell Row", sets: 4, reps: "8-10", restSeconds: 120 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "8-12", restSeconds: 90 },
          { exerciseName: "Lat Pulldown", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Seated Cable Row", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "T-Bar Row", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Straight Arm Pulldown", sets: 2, reps: "12-15", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 3, // Çarşamba — Bacak
        name: "Bacak Günü",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "6-10", restSeconds: 180 },
          { exerciseName: "Leg Press", sets: 4, reps: "10-15", restSeconds: 120 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Leg Extension", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Leg Curl (Yatarak)", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Hip Thrust", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "12-15", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 4, // Perşembe — Omuz
        name: "Omuz Günü",
        exercises: [
          { exerciseName: "Overhead Press (Military)", sets: 4, reps: "8-10", restSeconds: 120 },
          { exerciseName: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Arnold Press", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Lateral Raise", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Cable Lateral Raise", sets: 3, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Rear Delt Fly", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Cable Face Pull", sets: 3, reps: "15-20", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma — Kol (Biceps + Triceps)
        name: "Kol Günü (Biceps & Triceps)",
        exercises: [
          { exerciseName: "Barbell Curl", sets: 4, reps: "8-10", restSeconds: 90 },
          { exerciseName: "EZ Bar Curl", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Preacher Curl", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Hammer Curl", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Skull Crusher", sets: 4, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Close Grip Bench Press", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Rope Pushdown", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "10-12", restSeconds: 60 },
        ],
      },
    ],
  })),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. YAĞ YAKMA / KESİM PROGRAMI
//     Kaynak: NSCA ve ACSM genel yağ yakma prensipleri
//     Seviye: Orta | Hedef: Yağ Yakma & Kas Koruma
//     4 gün/hafta — 8 hafta
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const fatLossProgram: ProgramTemplate = {
  id: "fat-loss-circuit",
  name: "Yağ Yakma & Kesim (4 Gün)",
  description:
    "NSCA ve ACSM yağ yakma prensiplerine dayalı yüksek tempo full body program. Devre (circuit) antrenmanı + bileşik hareketler ile maksimum kalori yakımı ve kas koruması. Kısa dinlenme aralıkları metabolizmayı hızlandırır.",
  level: "intermediate",
  weeks: 8,
  daysPerWeek: 4,
  goal: "Yağ yakma, kas koruma ve kondisyon artışı",
  template: Array.from({ length: 8 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi — Full Body Devre A
        name: "Full Body Devre A",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Barbell Row", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 3, reps: "15", restSeconds: 45 },
          { exerciseName: "Overhead Press (Military)", sets: 3, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Mountain Climber", sets: 3, reps: "30 sn", restSeconds: 30 },
          { exerciseName: "Plank", sets: 3, reps: "45 sn", restSeconds: 30 },
        ],
      },
      {
        dayOfWeek: 2, // Salı — Üst Vücut + Kardiyo Devre
        name: "Üst Vücut + Kardiyo Devresi",
        exercises: [
          { exerciseName: "İncline Dumbbell Press", sets: 3, reps: "15", restSeconds: 45 },
          { exerciseName: "Lat Pulldown", sets: 3, reps: "15", restSeconds: 45 },
          { exerciseName: "Dumbbell Shoulder Press", sets: 3, reps: "15", restSeconds: 45 },
          { exerciseName: "Seated Cable Row", sets: 3, reps: "15", restSeconds: 45 },
          { exerciseName: "Burpee", sets: 4, reps: "10", restSeconds: 30 },
          { exerciseName: "Hammer Curl", sets: 3, reps: "15", restSeconds: 30 },
          { exerciseName: "Rope Pushdown", sets: 3, reps: "15", restSeconds: 30 },
        ],
      },
      {
        dayOfWeek: 4, // Perşembe — Alt Vücut + Kardiyo Devre
        name: "Alt Vücut + Kardiyo Devresi",
        exercises: [
          { exerciseName: "Goblet Squat", sets: 4, reps: "15-20", restSeconds: 45 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 4, reps: "15", restSeconds: 45 },
          { exerciseName: "Bulgarian Split Squat", sets: 3, reps: "12 (her bacak)", restSeconds: 45 },
          { exerciseName: "Hip Thrust", sets: 3, reps: "15", restSeconds: 45 },
          { exerciseName: "Jump Squat", sets: 4, reps: "10", restSeconds: 30 },
          { exerciseName: "Seated Calf Raise", sets: 4, reps: "20", restSeconds: 30 },
          { exerciseName: "Cable Crunch", sets: 3, reps: "20", restSeconds: 30 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma — Full Body Devre B (Yüksek Tempo)
        name: "Full Body Devre B (Hız)",
        exercises: [
          { exerciseName: "Deadlift", sets: 4, reps: "10", restSeconds: 60 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "Maksimum", restSeconds: 45 },
          { exerciseName: "Dumbbell Bench Press", sets: 3, reps: "15", restSeconds: 45 },
          { exerciseName: "Leg Press", sets: 3, reps: "20", restSeconds: 45 },
          { exerciseName: "Lateral Raise", sets: 3, reps: "20", restSeconds: 30 },
          { exerciseName: "Burpee", sets: 5, reps: "8", restSeconds: 30 },
          { exerciseName: "Hanging Leg Raise", sets: 3, reps: "15", restSeconds: 30 },
        ],
      },
    ],
  })),
};

// ═══════════════════════════════════════════════════════════
//  DIŞA AKTARILAN EK PROGRAM LİSTESİ
//  program-templates.ts içinde PROGRAM_TEMPLATES dizisine ekleyin:
//  ...ADDITIONAL_PROGRAM_TEMPLATES
// ═══════════════════════════════════════════════════════════
export const ADDITIONAL_PROGRAM_TEMPLATES: ProgramTemplate[] = [
  stronglifts5x5,        // Başlangıç — StrongLifts 5x5 (Mehdi)
  arnoldGoldenSix,       // Başlangıç — Arnold Golden Six
  bodyweightBeginner,    // Başlangıç — Ekipmansız Calisthenics
  texasMethod,           // Orta — Texas Method (Rippetoe)
  fiveThreeOneBBB,       // Orta — 5/3/1 BBB (Jim Wendler)
  phul,                  // Orta — PHUL (Brandon Campbell)
  redditPPL,             // Orta — Reddit PPL (Metallicadpa)
  phat,                  // İleri — PHAT (Dr. Layne Norton)
  classicBroSplit,       // Orta — Klasik Bro Split
  fatLossProgram,        // Orta — Yağ Yakma / Kesim
];
