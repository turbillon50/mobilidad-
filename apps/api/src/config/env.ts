import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  DB_POOL_MAX: z.coerce.number().default(20),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_MONTHLY_PRICE_ID: z.string().min(1),
  STRIPE_PER_TRIP_AMOUNT: z.coerce.number().default(150),
  CLERK_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_S3_PRESIGNED_URL_EXPIRES: z.coerce.number().default(3600),
  NEARBY_DRIVER_RADIUS_METERS: z.coerce.number().default(5000),
  OFFER_EXPIRY_SECONDS: z.coerce.number().default(30),
  SCHEDULED_RIDE_LEAD_TIME_MINUTES: z.coerce.number().default(15),
  DRIVER_TRIP_FEE_CENTS: z.coerce.number().default(150),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  BRAND_ID: z.string().default('mobilidad'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) { console.error('Invalid env:', result.error.flatten().fieldErrors); process.exit(1); }
  return result.data;
}

export const env = validateEnv();