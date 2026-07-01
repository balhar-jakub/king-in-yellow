import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.seznam.cz",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // TLS via STARTTLS on 587
  auth: {
    user: process.env.SMTP_USER || "info@plesvezlute.cz",
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "Ve Žluté <info@plesvezlute.cz>";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const info = await transporter.sendMail({
    from: FROM,
    to,
    subject,
    html,
  });
  return info;
}

export function sendMagicLinkEmail(email: string, token: string) {
  const link = `${process.env.SITE_URL || "https://plesvezlute.cz"}/api/auth/verify?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Vstupte do Žluté — Váš odkaz",
    html: `
      <div style="background:#0a0a0a; color:#d4cfc4; padding:40px; font-family:Georgia,serif; max-width:500px; margin:0 auto; border:1px solid #ddad31;">
        <h1 style="color:#ddad31; text-align:center; font-size:24px;">Ve Žluté</h1>
        <p style="font-style:italic; text-align:center; color:#9a9484;">Ve stínu králova pláště…</p>
        <hr style="border-color:#ddad31; border-width:1px 0 0 0; margin:20px 0;" />
        <p>Kliknutím vstupte:</p>
        <p style="text-align:center; margin:24px 0;">
          <a href="${link}" style="background:#ddad31; color:#0a0a0a; padding:12px 32px; text-decoration:none; font-weight:bold; display:inline-block;">
            VSTOUPIT DO ŽLUTÉ
          </a>
        </p>
        <p style="color:#9a9484; font-size:13px;">Odkaz vyprší za 15 minut.</p>
        <hr style="border-color:#ddad31; border-width:1px 0 0 0; margin:20px 0;" />
        <p style="text-align:center; color:#9a9484; font-size:12px;">
          — Ve Žluté, 20. 2. 2027, Plzeň —
        </p>
      </div>
    `,
  });
}
