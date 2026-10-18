import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  // With credentials, refuse to talk to the server unless STARTTLS succeeds.
  requireTLS: !env.SMTP_SECURE && Boolean(env.SMTP_USER),
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

export async function sendPasswordResetEmail(email: string, code: string, validMinutes: number) {
  await transport.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject: 'GibiGib: kod za promjenu lozinke',
    text: [
      `Tvoj kod za promjenu lozinke je ${code}.`,
      '',
      `Kod vrijedi ${validMinutes} minuta. Ako nisi tražio promjenu lozinke, zanemari ovu poruku.`,
    ].join('\n'),
  });
}
