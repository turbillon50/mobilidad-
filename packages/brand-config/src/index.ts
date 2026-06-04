import { mobilidadBrand } from './brands/mobilidad';
import { ridemeBrand } from './brands/rideme';

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

const BRAND_REGISTRY: Record<string, BrandConfig> = {
  mobilidad: mobilidadBrand,
  rideme: ridemeBrand,
};

export const ACTIVE_BRAND_ID = process.env.BRAND_ID ?? 'mobilidad';

export function getBrand(id: string): BrandConfig {
  const brand = BRAND_REGISTRY[id];
  if (!brand) throw new Error(`Brand "${id}" not found. Available: ${Object.keys(BRAND_REGISTRY).join(', ')}`);
  return brand;
}

export function getActiveBrand(): BrandConfig {
  return getBrand(ACTIVE_BRAND_ID);
}

/**
 * Returns space-separated RGB channels for use with CSS4 rgb(r g b / alpha) syntax
 * and Tailwind's <alpha-value> pattern (e.g. "108 99 255").
 */
function hexToRgbChannels(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return '0 0 0';
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ].join(' ');
}

/**
 * Returns inline CSS declarations (no braces) for all brand color tokens.
 * Inject into :root via a <style> tag in the document <head>.
 */
export function getBrandCssVars(brand: BrandConfig): string {
  const { colors } = brand;
  return [
    `--color-primary:${colors.primary}`,
    `--color-primary-rgb:${hexToRgbChannels(colors.primary)}`,
    `--color-primary-foreground:${colors.primaryForeground}`,
    `--color-secondary:${colors.secondary}`,
    `--color-secondary-rgb:${hexToRgbChannels(colors.secondary)}`,
    `--color-secondary-foreground:${colors.secondaryForeground}`,
    `--color-accent:${colors.accent}`,
    `--color-background:${colors.background}`,
    `--color-surface:${colors.surface}`,
    `--color-foreground:${colors.foreground}`,
    `--color-muted:${colors.muted}`,
    `--color-muted-foreground:${colors.mutedForeground}`,
    `--color-border:${colors.border}`,
    `--color-success:${colors.success}`,
    `--color-warning:${colors.warning}`,
    `--color-error:${colors.error}`,
  ].join(';');
}
