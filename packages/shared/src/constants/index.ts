// SaaS paket tier'ları
export const PACKAGE_TIERS = {
  STARTER: 1,
  PROFESSIONAL: 2,
  PREMIUM: 3,
} as const;

// Paket limitleri
export const PACKAGE_LIMITS = {
  [PACKAGE_TIERS.STARTER]: { maxStudents: 5 },
  [PACKAGE_TIERS.PROFESSIONAL]: { maxStudents: 10 },
  [PACKAGE_TIERS.PREMIUM]: { maxStudents: 999 }, // 15+ (unlimited)
} as const;

// Kullanıcı rolleri
export const USER_ROLES = {
  ADMIN: "admin",
  COACH: "coach",
  STUDENT: "student",
} as const;

// Abonelik durumları
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  PAST_DUE: "past_due",
} as const;

// Öğrenci durumları
export const STUDENT_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
} as const;

// Ödeme sağlayıcıları
export const PAYMENT_PROVIDERS = {
  IYZICO: "iyzico",
  STRIPE: "stripe",
} as const;

// Ödeme durumları
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

// Egzersiz kategorileri
export const EXERCISE_CATEGORIES = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
  "cardio",
  "full_body",
  "stretching",
] as const;

// Varsayılan branding renkleri
export const DEFAULT_BRANDING = {
  primaryColor: "#000000",
  secondaryColor: "#ccff00",
  templateId: "default",
} as const;

// Ana platform domain'i
export const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";
