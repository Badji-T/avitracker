// services/emailService.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpStore = new Map();
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS  = 3;

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: process.env.BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});


// Génère un code OTP à 6 chiffres
function generateOTPCode() {
  return crypto.randomInt(100000, 999999).toString();
}

//Envoi du code OTP par email
exports.sendEmailOTP = async (email) => {
  const code = generateOTPCode();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(email, { code, expiresAt, attempts: 0 });

  await transporter.sendMail({
    from: `"${process.env.BREVO_FROM_NAME}" <${process.env.BREVO_FROM_EMAIL}>`,
    to: email,
    subject: 'Ton code de vérification',
    text: `Ton code est : ${code}\n\nIl expire dans 10 minutes.\nSi tu n'as pas demandé ce code, ignore cet email.`,
  });
};

// Vérifie le code OTP pour l'email
exports.verifyEmailOTP = (email, code) => {
  const stored = otpStore.get(email);

  if (!stored) return false;

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return false;
  }

  if (stored.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(email);
    return false;
  }

  if (stored.code !== code) {
    stored.attempts += 1;
    return false;
  }

  otpStore.delete(email);
  return true;
};

/* Envoi d'un email de réinitialisation de mot de passe
// Fonction générique d'envoi d'email
const sendBrevoEmail = async ({ to, subject, text, htmlContent }) => {
  return transporter.sendMail({
    from: `"${process.env.BREVO_FROM_NAME}" <${process.env.BREVO_FROM_EMAIL}>`,
    to,
    subject,
    text,
    html: htmlContent,
  });
};

// Envoi d'un email de réinitialisation de mot de passe
exports.sendResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  return sendBrevoEmail({
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
    htmlContent: `
      <h2>Réinitialisation de votre mot de passe</h2>
      <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expire dans 1 heure.</p>
    `,
  });
};*/

exports.transporter = transporter;