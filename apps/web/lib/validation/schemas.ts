import { z } from "zod";

// ─── Ortak ───
const cuid = z.string().min(1).max(30);
const domain = z.string().min(1).max(63);
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Geçersiz renk kodu");

// ─── Auth ───
export const signUpSchema = z
  .object({
    email: z.string().email("Geçerli bir e-posta girin").max(255),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı").max(128),
    confirmPassword: z.string().min(8, "Şifre tekrarı en az 8 karakter olmalı").max(128),
    name: z.string().min(2, "İsim en az 2 karakter olmalı").max(100).trim(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin").max(255),
  password: z.string().min(1, "Şifre zorunlu").max(128),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin").max(255),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, "Şifre en az 8 karakter olmalı").max(128),
});

export const studentSignupSchema = z
  .object({
    email: z.string().email("Geçerli bir e-posta girin.").max(255).trim().toLowerCase(),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı.").max(128),
    confirmPassword: z.string().min(8).max(128),
    name: z.string().min(2, "İsim en az 2 karakter olmalı.").max(100).trim(),
    phone: z.string().max(30).trim().optional(),
    code: z
      .string()
      .min(6, "Koç kodu geçersiz.")
      .max(32)
      .trim()
      .transform((v) => v.toUpperCase()),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

// ─── Onboarding ───
const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;

export const createCoachSiteSchema = z.object({
  brandName: z.string().min(2, "Marka adı en az 2 karakter olmalı").max(60).trim(),
  subdomain: z
    .string()
    .min(3, "Alan adı en az 3 karakter olmalı")
    .max(32, "Alan adı en fazla 32 karakter olabilir")
    .regex(subdomainRegex, "Sadece küçük harf, rakam ve tire (-) kullanın. Başta/sonda tire olamaz."),
  landingThemeId: z.number().int().min(1).max(7),
  dashboardThemeId: z.number().int().min(1).max(7),
  tier: z.number().int().min(1).max(3),
  logoUrl: z.string().url().max(500).optional(),
});

// ─── Student Invites ───
export const createStudentInviteSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin.").max(255).trim(),
  name: z.string().min(2, "İsim en az 2 karakter olmalı.").max(100).trim(),
  packageId: z.string().min(1).max(50).optional(),
  expiresInDays: z.number().int().min(1).max(30).optional(),
});

export const claimInviteSchema = z.object({
  password: z.string().min(8, "Şifre en az 8 karakter olmalı.").max(128),
  phone: z.string().max(30).trim().optional(),
});

export const createRegistrationCodeSchema = z.object({
  label: z.string().max(100).trim().optional(),
  packageId: z.string().min(1).max(50).optional(),
  expiresInDays: z.number().int().min(1).max(90).optional(),
});

// ─── Section Builder ───
export const faqItemSchema = z.object({
  id: z.string().min(1).max(40),
  question: z.string().min(1, "Soru zorunlu").max(200, "Soru en fazla 200 karakter").trim(),
  answer: z.string().min(1, "Cevap zorunlu").max(2000, "Cevap en fazla 2000 karakter").trim(),
});

export const landingFaqsSchema = z.array(faqItemSchema).max(20, "En fazla 20 SSS kaydedebilirsiniz.");

// ─── Coach Settings ───
export const updateCoachSettingsSchema = z.object({
  brandName: z.string().min(1).max(100).trim().optional(),
  bio: z.string().max(2000).trim().optional(),
  primaryColor: hexColor.optional(),
  secondaryColor: hexColor.optional(),
  heroImageOriginalUrl: z.string().url().max(500).nullable().optional(),
  heroImageDesktopUrl: z.string().url().max(500).nullable().optional(),
  heroImageMobileUrl: z.string().url().max(500).nullable().optional(),
  heroImageBlurDataUrl: z.string().max(50000).nullable().optional(),
  heroImageCutoutUrl: z.string().url().max(500).nullable().optional(),
  heroFocalX: z.number().int().min(0).max(100).optional(),
  heroFocalY: z.number().int().min(0).max(100).optional(),
  heroMode: z.enum(["photo", "logo"]).optional(),
  heroVideoUrl: z.string().url().max(500).nullable().optional(),
  themeId: z.string().max(30).optional(),
  templateId: z.string().max(30).optional(),
  landingThemeId: z.number().int().min(1).max(7).optional(),
  dashboardThemeId: z.number().int().min(1).max(7).optional(),
  dashboardTemplateId: z.string().max(30).optional(),
  sidebarPosition: z.enum(["left", "bottom", "right"]).optional(),
  landingConfig: z.record(z.unknown()).nullable().optional(),
  eliteConfig: z.record(z.unknown()).nullable().optional(),
  socialLinks: z.record(z.string().max(500)).nullable().optional(),
  headingFont: z.string().max(100).nullable().optional(),
  bodyFont: z.string().max(100).nullable().optional(),
  heroImageDark: z.boolean().nullable().optional(),
  landingTexts: z.record(z.unknown()).nullable().optional(),
  landingFaqs: landingFaqsSchema.nullable().optional(),
  aboutText: z.string().max(5000).nullable().optional(),
  whatsappNumber: z.string().max(20).nullable().optional(),
  contactPhone: z.string().max(30).nullable().optional(),
  businessAddress: z.string().max(500).nullable().optional(),
  legalFullName: z.string().max(150).nullable().optional(),
  taxId: z.string().max(30).nullable().optional(),
  legalTexts: z.record(z.string().max(50000)).nullable().optional(),
  siteMode: z.enum(["TEMPLATE", "BUILDER"]).optional(),
});

export const updatePaymentSettingsSchema = z.object({
  iyzicoApiKey: z.string().max(200).optional(),
  iyzicoSecretKey: z.string().max(200).optional(),
});

// ─── Programs ───
export const createProgramSchema = z.object({
  name: z.string().min(1, "Program adı zorunlu").max(200).trim(),
  description: z.string().max(2000).trim().optional(),
  weeks: z.number().int().min(1).max(52),
});

export const addWorkoutSchema = z.object({
  weekNumber: z.number().int().min(1).max(52),
  dayOfWeek: z.number().int().min(0).max(6),
  name: z.string().min(1).max(200).trim(),
});

export const addExerciseToWorkoutSchema = z.object({
  exerciseId: cuid,
  sets: z.number().int().min(1).max(100),
  reps: z.string().min(1).max(50).trim(),
  restSeconds: z.number().int().min(0).max(600).optional(),
  notes: z.string().max(500).trim().optional(),
});

export const updateWorkoutExerciseSchema = z.object({
  sets: z.number().int().min(1).max(100),
  reps: z.string().min(1).max(50).trim(),
  restSeconds: z.number().int().min(0).max(600).optional(),
  notes: z.string().max(500).trim().optional(),
});

// ─── Nutrition ───
const foodSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  portion: z.string().min(1).max(100).trim(),
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(1000),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(1000),
  sugar: z.number().min(0).max(1000).optional(),
  fiber: z.number().min(0).max(1000).optional(),
});

const supplementSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  dosage: z.string().min(1).max(100).trim(),
  timing: z.string().min(1).max(100).trim(),
  notes: z.string().max(500).trim().optional(),
});

export const createNutritionPlanSchema = z.object({
  name: z.string().min(1, "Plan adı zorunlu").max(200).trim(),
  targetCalories: z.number().int().min(0).max(20000).optional(),
  targetProtein: z.number().int().min(0).max(2000).optional(),
  targetCarbs: z.number().int().min(0).max(2000).optional(),
  targetFat: z.number().int().min(0).max(2000).optional(),
  coachNotes: z.string().max(5000).trim().optional(),
  supplements: z.array(supplementSchema).max(50).optional(),
});

export const addMealSchema = z.object({
  name: z.string().min(1, "Öğün adı zorunlu").max(200).trim(),
  time: z.string().max(20).trim().optional(),
  foods: z.array(foodSchema).min(1).max(100),
});

export const updateMealSchema = addMealSchema;

// ─── Admin ───
export const updateSubscriptionSchema = z.object({
  subscriptionStatus: z.enum(["active", "cancelled", "past_due", "paused"]).optional(),
  packageId: cuid.optional(),
});

// ─── Packages (CoachPackage) ───
export const coachPackageSchema = z.object({
  name: z.string().min(1, "Paket adı zorunlu").max(200).trim(),
  description: z.string().max(2000).trim(),
  duration: z.number().int().min(1).max(365),
  price: z.number().min(0).max(1000000),
  currency: z.enum(["TRY", "USD", "EUR"]),
  features: z.string().max(5000),
  isActive: z.boolean(),
});

// ─── Meal Log (öğrenci günlük öğün foto + not) ───
export const mealTypeSchema = z.enum(["breakfast", "lunch", "dinner", "snack"]);

export const mealEntryCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-MM-DD formatında olmalı"),
  mealType: mealTypeSchema,
  photoUrl: z.string().url("Geçerli bir URL gerekli").max(500),
  note: z.string().max(500).trim().optional().nullable(),
  eatenAt: z.string().datetime().optional().nullable(),
});

export const mealEntryUpdateSchema = z.object({
  note: z.string().max(500).trim().optional().nullable(),
  photoUrl: z.string().url().max(500).optional(),
});

// ─── Helper ───
export function parseOrError<T>(schema: z.ZodSchema<T>, data: unknown): { data: T } | { error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Geçersiz veri" };
  }
  return { data: result.data };
}
