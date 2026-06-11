const { client, verifySid } = require('../../config/twilio');

// Envoyer le code OTP par SMS
async function sendSmsOTP(phoneNumber) {
  // phoneNumber doit être au format E.164 : +22376000000
  const verification = await client.verify.v2
    .services(verifySid)
    .verifications.create({
      to: phoneNumber,
      channel: 'sms',
    });

  return verification.status; // 'pending'
}

// Vérifier le code OTP
async function verifySmsOTP(phoneNumber, code) {
  const result = await client.verify.v2
    .services(verifySid)
    .verificationChecks.create({
      to: phoneNumber,
      code,
    });

  return result.status; // 'approved' | 'pending' | 'canceled'
}

module.exports = { sendSmsOTP, verifySmsOTP };