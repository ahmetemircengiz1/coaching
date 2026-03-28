// Tüm şablonların ortak aldığı props

export interface CoachPackageData {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
  features: string[];
}

export interface TransformationData {
  id: string;
  clientName: string;
  beforePhoto: string;
  afterPhoto: string;
  duration: string | null;
  description: string | null;
}

export interface TemplateProps {
  domain: string;
  brandName: string;
  bio: string | null;
  logo: string | null;
  email: string;
  primaryColor: string;
  secondaryColor: string;
  packages: CoachPackageData[];
  transformations: TransformationData[];
  studentCount: number;
  authUrl: string;
}
