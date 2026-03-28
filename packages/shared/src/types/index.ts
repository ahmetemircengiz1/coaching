import type {
  PACKAGE_TIERS,
  USER_ROLES,
  SUBSCRIPTION_STATUS,
  STUDENT_STATUS,
  PAYMENT_PROVIDERS,
  PAYMENT_STATUS,
  EXERCISE_CATEGORIES,
} from "../constants";

// Utility types
export type ValueOf<T> = T[keyof T];

// Paket tier tipi
export type PackageTier = ValueOf<typeof PACKAGE_TIERS>;

// Kullanıcı rolü
export type UserRole = ValueOf<typeof USER_ROLES>;

// Abonelik durumu
export type SubscriptionStatus = ValueOf<typeof SUBSCRIPTION_STATUS>;

// Öğrenci durumu
export type StudentStatus = ValueOf<typeof STUDENT_STATUS>;

// Ödeme sağlayıcı
export type PaymentProvider = ValueOf<typeof PAYMENT_PROVIDERS>;

// Ödeme durumu
export type PaymentStatus = ValueOf<typeof PAYMENT_STATUS>;

// Egzersiz kategorisi
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

// Coach branding
export interface CoachBranding {
  primaryColor: string;
  secondaryColor: string;
  templateId: string;
  logo?: string;
  brandName: string;
}

// Tenant bilgisi (middleware'den gelen)
export interface TenantInfo {
  id: string;
  subdomain: string;
  customDomain?: string;
  branding: CoachBranding;
  packageTier: PackageTier;
}

// Beslenme makro hedefleri
export interface MacroTargets {
  calories?: number;
  protein?: number; // gram
  carbs?: number; // gram
  fat?: number; // gram
}

// Yiyecek bilgisi (JSON field)
export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Antrenman set bilgisi (JSON field)
export interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

// Antrenman log entry (JSON field)
export interface TrainingLogEntry {
  exerciseId: string;
  sets: ExerciseSet[];
}
