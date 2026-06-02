export interface BrandColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface BrandTypography {
  fontSans: string;
  fontMono: string;
}

export interface BrandLegal {
  companyName: string;
  jurisdiction: string;
  contactEmail: string;
  privacyUrl?: string;
  termsUrl?: string;
  taxId?: string;
}

export interface BrandFeatures {
  negotiableFares: boolean;
  scheduledRides: boolean;
  multiplePaymentMethods: boolean;
  driverRating: boolean;
  passengerRating: boolean;
  realTimeTracking: boolean;
  inAppChat: boolean;
  surgeMultiplier: boolean;
  corporateAccounts: boolean;
}

export interface BrandFareConfig {
  currency: string;
  currencySymbol: string;
  locale: string;
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  maxSurgeMultiplier: number;
  platformCommissionPercent: number;
  minFare: number;
  maxFare: number;
}

export interface BrandConfig {
  id: string;
  appName: string;
  tagline: string;
  logoText: string;
  description: string;
  colors: BrandColors;
  typography: BrandTypography;
  legal: BrandLegal;
  features: BrandFeatures;
  fares: BrandFareConfig;
  supportedLanguages: string[];
  defaultLanguage: string;
  mapsProvider: 'google' | 'mapbox' | 'openstreetmap';
  appStoreUrl?: string;
  playStoreUrl?: string;
  websiteUrl?: string;
}

export { mobilidadBrand } from './brands/mobilidad';
export { ridemeBrand } from './brands/rideme';

export function getBrand(id: string): BrandConfig {
  const brands: Record<string, BrandConfig> = {
    mobilidad: require('./brands/mobilidad').mobilidadBrand,
    rideme: require('./brands/rideme').ridemeBrand,
  };
  const brand = brands[id];
  if (!brand) throw new Error(`Brand "${id}" not found. Available: ${Object.keys(brands).join(', ')}`);
  return brand;
}

export const ACTIVE_BRAND_ID = process.env.BRAND_ID ?? 'mobilidad';
