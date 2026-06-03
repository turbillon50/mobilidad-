import { Resend } from 'resend';
import { env } from '../config/env';
import { query } from '../config/database';
import { logger } from '../utils/logger';

const resend = new Resend(env.RESEND_API_KEY);

export interface PushNotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushToUser(userId: string, payload: PushNotificationData): Promise<void> {
  try {
    const { rows } = await query<{ fcm_token: string | null }>('SELECT fcm_token FROM users WHERE id = $1', [userId]);
    const token = rows[0]?.fcm_token;
    if (!token) return;
    const { getMessaging } = await import('../config/firebase');
    await getMessaging().send({ token, notification: { title: payload.title, body: payload.body }, data: payload.data });
  } catch (err) { logger.error('Push notification failed', { userId, err }); }
}

export async function sendOtpSms(phone: string, code: string): Promise<void> {
  logger.info(`OTP ${code} for ${phone}`);
}

export async function sendEmailToUser(userId: string, subject: string, html: string): Promise<void> {
  try {
    const { rows } = await query<{ email: string | null }>('SELECT email FROM users WHERE id = $1', [userId]);
    if (!rows[0]?.email) return;
    await resend.emails.send({ from: env.RESEND_FROM_EMAIL, to: rows[0].email, subject, html });
  } catch (err) { logger.error('Email send failed', { userId, err }); }
}