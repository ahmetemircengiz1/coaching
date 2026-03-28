// Hazır antrenman program şablonları
// Koçlar tek tıkla kendi kütüphanelerine ekleyebilir

export interface TemplateExercise {
  exerciseName: string; // Sistem egzersiz adıyla eşleşir
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface TemplateWorkout {
  dayOfWeek: number; // 1=Pazartesi ... 7=Pazar
  name: string;
  exercises: TemplateExercise[];
}

export interface TemplateWeek {
  weekNumber: number;
  workouts: TemplateWorkout[];
}

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  weeks: number;
  daysPerWeek: number;
  goal: string;
  template: TemplateWeek[];
}

// ═══ BAŞLANGIÇ SEVİYE ═══
const beginnerFullBody: ProgramTemplate = {
  id: "beginner-fullbody",
  name: "Başlangıç - Full Body (3 Gün)",
  description: "Spora yeni başlayanlar için 4 haftalık temel program. Haftada 3 gün full body antrenman.",
  level: "beginner",
  weeks: 4,
  daysPerWeek: 3,
  goal: "Temel güç ve kas dayanıklılığı",
  template: Array.from({ length: 4 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi
        name: "Full Body A",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Bench Press (Düz Bank)", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Barbell Row", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Plank", sets: 3, reps: "30-45 sn", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 3, // Çarşamba
        name: "Full Body B",
        exercises: [
          { exerciseName: "Leg Press", sets: 3, reps: "12-15", restSeconds: 90 },
          { exerciseName: "Dumbbell Bench Press", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Lat Pulldown", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Lateral Raise", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Crunch", sets: 3, reps: "15-20", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma
        name: "Full Body C",
        exercises: [
          { exerciseName: "Goblet Squat", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Machine Chest Press", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Seated Cable Row", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Dumbbell Curl", sets: 2, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Triceps Pushdown (Kablo)", sets: 2, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Leg Raise (Yere Yatarak)", sets: 3, reps: "12-15", restSeconds: 45 },
        ],
      },
    ],
  })),
};

// ═══ ORTA SEVİYE ═══
const intermediateUpperLower: ProgramTemplate = {
  id: "intermediate-upper-lower",
  name: "Orta Seviye - Upper/Lower Split (4 Gün)",
  description: "4 günlük üst/alt vücut split programı. Kas kütlesi ve güç artışı için ideal.",
  level: "intermediate",
  weeks: 6,
  daysPerWeek: 4,
  goal: "Kas kütlesi ve güç artışı",
  template: Array.from({ length: 6 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Pazartesi - Üst Vücut Güç
        name: "Üst Vücut - Güç",
        exercises: [
          { exerciseName: "Bench Press (Düz Bank)", sets: 4, reps: "6-8", restSeconds: 120 },
          { exerciseName: "Barbell Row", sets: 4, reps: "6-8", restSeconds: 120 },
          { exerciseName: "Overhead Press (Military)", sets: 3, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 3, reps: "6-10", restSeconds: 90 },
          { exerciseName: "Barbell Curl", sets: 3, reps: "8-10", restSeconds: 60 },
          { exerciseName: "Skull Crusher", sets: 3, reps: "8-10", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 2, // Salı - Alt Vücut Güç
        name: "Alt Vücut - Güç",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "6-8", restSeconds: 150 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 4, reps: "8-10", restSeconds: 120 },
          { exerciseName: "Leg Press", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Leg Curl (Yatarak)", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 4, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Hanging Leg Raise", sets: 3, reps: "10-15", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 4, // Perşembe - Üst Vücut Hipertrofi
        name: "Üst Vücut - Hipertrofi",
        exercises: [
          { exerciseName: "İncline Dumbbell Press", sets: 4, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Dumbbell Row", sets: 4, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Cable Crossover", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Cable Face Pull", sets: 3, reps: "15-20", restSeconds: 60 },
          { exerciseName: "Lateral Raise", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Hammer Curl", sets: 3, reps: "10-12", restSeconds: 45 },
          { exerciseName: "Rope Pushdown", sets: 3, reps: "12-15", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 5, // Cuma - Alt Vücut Hipertrofi
        name: "Alt Vücut - Hipertrofi",
        exercises: [
          { exerciseName: "Front Squat", sets: 3, reps: "8-10", restSeconds: 120 },
          { exerciseName: "Bulgarian Split Squat", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Leg Extension", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Seated Leg Curl", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Hip Thrust", sets: 4, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Seated Calf Raise", sets: 4, reps: "15-20", restSeconds: 45 },
          { exerciseName: "Cable Crunch", sets: 3, reps: "15-20", restSeconds: 45 },
        ],
      },
    ],
  })),
};

// ═══ İLERİ SEVİYE ═══
const advancedPPL: ProgramTemplate = {
  id: "advanced-ppl",
  name: "İleri Seviye - Push/Pull/Legs (6 Gün)",
  description: "6 günlük PPL split. Deneyimli sporcular için yoğun hacimli program.",
  level: "advanced",
  weeks: 8,
  daysPerWeek: 6,
  goal: "Maksimum kas gelişimi",
  template: Array.from({ length: 8 }, (_, w) => ({
    weekNumber: w + 1,
    workouts: [
      {
        dayOfWeek: 1, // Push A
        name: "Push A (Göğüs Odaklı)",
        exercises: [
          { exerciseName: "Bench Press (Düz Bank)", sets: 4, reps: "5-8", restSeconds: 150 },
          { exerciseName: "İncline Dumbbell Press", sets: 4, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Dumbbell Fly", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Overhead Press (Military)", sets: 3, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Lateral Raise", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Rope Pushdown", sets: 3, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Overhead Triceps Extension", sets: 3, reps: "10-12", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 2, // Pull A
        name: "Pull A (Sırt Odaklı)",
        exercises: [
          { exerciseName: "Deadlift", sets: 4, reps: "5-6", restSeconds: 180 },
          { exerciseName: "Pull-Up (Barfiks)", sets: 4, reps: "6-10", restSeconds: 90 },
          { exerciseName: "Barbell Row", sets: 4, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Cable Face Pull", sets: 3, reps: "15-20", restSeconds: 60 },
          { exerciseName: "EZ Bar Curl", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Hammer Curl", sets: 3, reps: "10-12", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 3, // Legs A
        name: "Legs A (Quadriceps Odaklı)",
        exercises: [
          { exerciseName: "Squat (Barbell)", sets: 4, reps: "5-8", restSeconds: 180 },
          { exerciseName: "Hack Squat", sets: 3, reps: "8-10", restSeconds: 120 },
          { exerciseName: "Leg Extension", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Romanian Deadlift (RDL)", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Leg Curl (Yatarak)", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Calf Raise (Ayakta)", sets: 5, reps: "12-15", restSeconds: 60 },
        ],
      },
      {
        dayOfWeek: 4, // Push B
        name: "Push B (Omuz Odaklı)",
        exercises: [
          { exerciseName: "Overhead Press (Military)", sets: 4, reps: "6-8", restSeconds: 120 },
          { exerciseName: "İncline Bench Press", sets: 4, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Arnold Press", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Cable Crossover", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Cable Lateral Raise", sets: 4, reps: "12-15", restSeconds: 45 },
          { exerciseName: "Close Grip Bench Press", sets: 3, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Single Arm Pushdown", sets: 3, reps: "10-12", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 5, // Pull B
        name: "Pull B (Genişlik Odaklı)",
        exercises: [
          { exerciseName: "Lat Pulldown", sets: 4, reps: "8-10", restSeconds: 90 },
          { exerciseName: "T-Bar Row", sets: 4, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Seated Cable Row", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Straight Arm Pulldown", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Rear Delt Fly", sets: 3, reps: "15-20", restSeconds: 45 },
          { exerciseName: "Preacher Curl", sets: 3, reps: "10-12", restSeconds: 60 },
          { exerciseName: "Reverse Curl", sets: 3, reps: "12-15", restSeconds: 45 },
        ],
      },
      {
        dayOfWeek: 6, // Legs B
        name: "Legs B (Hamstring/Kalça Odaklı)",
        exercises: [
          { exerciseName: "Sumo Deadlift", sets: 4, reps: "6-8", restSeconds: 150 },
          { exerciseName: "Hip Thrust (Barbell)", sets: 4, reps: "8-10", restSeconds: 90 },
          { exerciseName: "Bulgarian Split Squat", sets: 3, reps: "10-12", restSeconds: 90 },
          { exerciseName: "Seated Leg Curl", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Leg Extension", sets: 3, reps: "12-15", restSeconds: 60 },
          { exerciseName: "Seated Calf Raise", sets: 5, reps: "15-20", restSeconds: 45 },
          { exerciseName: "Hanging Leg Raise", sets: 3, reps: "12-15", restSeconds: 60 },
        ],
      },
    ],
  })),
};

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  beginnerFullBody,
  intermediateUpperLower,
  advancedPPL,
];

export const LEVEL_LABELS: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta Seviye",
  advanced: "İleri Seviye",
};

export const LEVEL_COLORS: Record<string, string> = {
  beginner: "text-green-400 bg-green-400/10 border-green-400/20",
  intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  advanced: "text-red-400 bg-red-400/10 border-red-400/20",
};
