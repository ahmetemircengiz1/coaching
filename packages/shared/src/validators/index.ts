import { z } from "zod";

// Coach onboarding form validasyonu
export const coachOnboardingSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  brandName: z.string().min(2, "Marka adı en az 2 karakter olmalı"),
  subdomain: z
    .string()
    .min(3, "Subdomain en az 3 karakter olmalı")
    .max(30, "Subdomain en fazla 30 karakter olabilir")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain sadece küçük harf, rakam ve tire içerebilir"
    ),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Geçersiz renk kodu"),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Geçersiz renk kodu"),
  templateId: z.string().default("default"),
});

// Coach paket oluşturma validasyonu
export const coachPackageSchema = z.object({
  name: z.string().min(2, "Paket adı en az 2 karakter olmalı"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
  duration: z.number().int().min(1, "Süre en az 1 hafta olmalı"),
  price: z.number().positive("Fiyat pozitif olmalı"),
  currency: z.string().default("TRY"),
  features: z.array(z.string()).min(1, "En az 1 özellik eklenmeli"),
});

// Öğrenci kayıt validasyonu
export const studentRegistrationSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçersiz e-posta adresi"),
  phone: z.string().optional(),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

// Haftalık check-in validasyonu
export const weeklyCheckInSchema = z.object({
  weight: z.number().positive().optional(),
  bodyFat: z.number().min(0).max(100).optional(),
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  arms: z.number().positive().optional(),
  thighs: z.number().positive().optional(),
  energyLevel: z.number().int().min(1).max(10).optional(),
  sleepQuality: z.number().int().min(1).max(10).optional(),
  stressLevel: z.number().int().min(1).max(10).optional(),
  compliance: z.number().int().min(0).max(100).optional(),
  notes: z.string().optional(),
});

// Mesaj gönderme validasyonu
export const messageSchema = z.object({
  content: z.string().min(1, "Mesaj boş olamaz"),
  attachments: z.array(z.string().url()).optional(),
});

// Egzersiz oluşturma validasyonu
export const exerciseSchema = z.object({
  name: z.string().min(2, "Egzersiz adı en az 2 karakter olmalı"),
  category: z.string(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

// Beslenme planı validasyonu
export const nutritionPlanSchema = z.object({
  name: z.string().min(2, "Plan adı en az 2 karakter olmalı"),
  targetCalories: z.number().positive().optional(),
  targetProtein: z.number().positive().optional(),
  targetCarbs: z.number().positive().optional(),
  targetFat: z.number().positive().optional(),
});

export type CoachOnboardingInput = z.infer<typeof coachOnboardingSchema>;
export type CoachPackageInput = z.infer<typeof coachPackageSchema>;
export type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>;
export type WeeklyCheckInInput = z.infer<typeof weeklyCheckInSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type NutritionPlanInput = z.infer<typeof nutritionPlanSchema>;
