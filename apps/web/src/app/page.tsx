import { getBrand } from '@mobilidad/brand-config';
import { LandingPage } from './LandingPage';

export default function Page() {
  const brand = getBrand(process.env.BRAND_ID ?? 'mobilidad');
  return (
    <LandingPage
      appName={brand.appName}
      tagline={brand.tagline}
      logoText={brand.logoText}
    />
  );
}
