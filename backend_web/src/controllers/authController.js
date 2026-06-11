// controllers/authController.js
const { User } = require('../models');
const { sendSmsOTP, verifySmsOTP } = require('../services/twilioService');
const { sendEmailOTP, verifyEmailOTP } = require('../services/brevoService');
const { formatPhone, isValidPhone } = require('../utils/formatPhone');

// ─── HELPER INTERNE ───────────────────────────────────────────────────

async function checkOTP(channel, tel, email, code) {
  if (channel === 'email') {
    return verifyEmailOTP(email, code);
  }
  const status = await verifySmsOTP(tel, code);
  return status === 'approved';
}

// ─── ENVOYER LE CODE OTP ──────────────────────────────────────────────

exports.sendOTP = async (req, res) => {
  const { tel, email, channel } = req.body;

  if (!tel) {
    return res.status(400).json({ error: 'Numéro de téléphone requis.' });
  }

  const formattedPhone = formatPhone(tel);
  if (!isValidPhone(formattedPhone)) {
    return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
  }

  try {
    if (channel === 'email') {
      if (!email) return res.status(400).json({ error: 'Email requis.' });
      await sendEmailOTP(email);
    } else {
      await sendSmsOTP(formattedPhone);
    }
    res.json({ success: true, message: 'Code envoyé.' });
  } catch (err) {
    console.error('sendOTP error:', err);
    res.status(500).json({ error: "Erreur lors de l'envoi du code." });
  }
};

// ─── INSCRIPTION ──────────────────────────────────────────────────────

exports.register = async (req, res) => {
  const { tel, email, nom, prenom, username, code, channel } = req.body;

  if (!tel || !code) {
    return res.status(400).json({ error: 'Numéro et code OTP requis.' });
  }

  const formattedPhone = formatPhone(tel);
  if (!isValidPhone(formattedPhone)) {
    return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
  }

  try {
    // 1. Numéro déjà utilisé ?
    const existing = await User.findOne({ where: { tel: formattedPhone } });
    if (existing) {
      return res.status(409).json({ error: 'Ce numéro est déjà associé à un compte.' });
    }

    // 2. Vérifier le code OTP
    const approved = await checkOTP(channel, formattedPhone, email, code);
    if (!approved) {
      return res.status(400).json({ error: 'Code invalide ou expiré.' });
    }

    // 3. Créer le user seulement après vérification
    const user = await User.create({
      nom,
      prenom,
      username,
      tel: formattedPhone,
      email: email || null,
      phoneVerified: true,
    });

    // 4. Générer le JWT
    const token = generateJWT(user);
    res.status(201).json({
      message: 'Compte créé avec succès.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── CONNEXION ────────────────────────────────────────────────────────

exports.login = async (req, res) => {
  const { tel, email, code, channel } = req.body;

  if (!tel || !code) {
    return res.status(400).json({ error: 'Numéro et code OTP requis.' });
  }

  const formattedPhone = formatPhone(tel);
  if (!isValidPhone(formattedPhone)) {
    return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
  }

  try {
    // 1. Vérifier le code OTP
    const approved = await checkOTP(channel, formattedPhone, email, code);
    if (!approved) {
      return res.status(400).json({ error: 'Code invalide ou expiré.' });
    }

    // 2. Retrouver le user
    const user = await User.findOne({ where: { tel: formattedPhone } });
    if (!user) {
      return res.status(404).json({ error: 'Aucun compte trouvé pour ce numéro.' });
    }

    // 3. Générer le JWT
    const token = generateJWT(user);
    res.json({
      message: 'Connexion réussie.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─── HELPER : champs publics du user ─────────────────────────────────

function sanitizeUser(user) {
  return {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    username: user.username,
    tel: user.tel,
    email: user.email,
    role: user.role,
  };
}