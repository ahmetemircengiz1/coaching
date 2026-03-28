// Şablon Sistemi - Landing + Dashboard Template Registry

// ========== LANDING TEMPLATES ==========
export type LandingTemplateId = "classic-dark" | "modern-teal" | "fresh-light" | "clean-red" | "sport-dark";

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  previewStyle: "dark" | "light" | "gradient";
}

export const LANDING_TEMPLATES: Record<LandingTemplateId, TemplateInfo> = {
  "classic-dark": {
    id: "classic-dark",
    name: "Klasik Koyu",
    description: "Siyah arka plan, altın vurgular, lüks koçluk hissi.",
    previewStyle: "dark",
  },
  "modern-teal": {
    id: "modern-teal",
    name: "Modern Teal",
    description: "Koyu tema, turkuaz aksan, beyaz paket kartları.",
    previewStyle: "dark",
  },
  "fresh-light": {
    id: "fresh-light",
    name: "Fresh Light",
    description: "Açık arka plan, sarı-turuncu sıçramalar, enerjik.",
    previewStyle: "light",
  },
  "clean-red": {
    id: "clean-red",
    name: "Clean Red",
    description: "Beyaz fon, kırmızı aksan, profesyonel ve temiz.",
    previewStyle: "light",
  },
  "sport-dark": {
    id: "sport-dark",
    name: "Sport Dark",
    description: "Koyu tema, neon vurgular, dinamik spor enerjisi.",
    previewStyle: "gradient",
  },
};

// ========== DASHBOARD TEMPLATES ==========
export type DashboardTemplateId = "dark-teal" | "dark-gold" | "light-gold" | "dark-orange" | "light-modern";

export const DASHBOARD_TEMPLATES: Record<DashboardTemplateId, TemplateInfo> = {
  "dark-teal": {
    id: "dark-teal",
    name: "Koyu Teal",
    description: "Siyah sidebar, teal vurgular, profesyonel.",
    previewStyle: "dark",
  },
  "dark-gold": {
    id: "dark-gold",
    name: "Koyu Altın",
    description: "Siyah tema, altın detaylar, lüks his.",
    previewStyle: "dark",
  },
  "light-gold": {
    id: "light-gold",
    name: "Açık Altın",
    description: "Beyaz arka plan, sarı-altın aksan, aydınlık.",
    previewStyle: "light",
  },
  "dark-orange": {
    id: "dark-orange",
    name: "Koyu Turuncu",
    description: "Koyu tema, turuncu aksanlar, güçlü.",
    previewStyle: "dark",
  },
  "light-modern": {
    id: "light-modern",
    name: "Açık Modern",
    description: "Beyaz tema, mor-mavi sidebar, modern.",
    previewStyle: "light",
  },
};

// Paket bazlı erişim
export const TIER_TEMPLATES = {
  1: {
    landing: ["classic-dark"] as LandingTemplateId[],
    dashboard: ["dark-teal"] as DashboardTemplateId[],
  },
  2: {
    landing: ["classic-dark", "modern-teal", "fresh-light"] as LandingTemplateId[],
    dashboard: ["dark-teal", "dark-gold", "light-gold"] as DashboardTemplateId[],
  },
  3: {
    landing: ["classic-dark", "modern-teal", "fresh-light", "clean-red", "sport-dark"] as LandingTemplateId[],
    dashboard: ["dark-teal", "dark-gold", "light-gold", "dark-orange", "light-modern"] as DashboardTemplateId[],
  },
};

export const LANDING_TEMPLATE_LIST = Object.values(LANDING_TEMPLATES);
export const DASHBOARD_TEMPLATE_LIST = Object.values(DASHBOARD_TEMPLATES);

// Eski uyumluluk - TemplateId
export type TemplateId = LandingTemplateId;
export const TEMPLATES = LANDING_TEMPLATES;
