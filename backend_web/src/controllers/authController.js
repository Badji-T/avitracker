const { User } = require('../models');
const { Op } = require('sequelize');
const { sendSmsOTP, verifySmsOTP } = require('../services/twilioService');
const { sendEmailOTP, verifyEmailOTP } = require('../services/brevoService');
const { formatPhone, isValidPhone } = require('../utils/formatPhone');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// JWT

function generateJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
}


// HELPERS

function validateChannel(channel) {
  return ['sms', 'email'].includes(channel);
}

function validatePhone(tel) {
  if (!tel) {
    throw new Error('Numéro de téléphone requis.');
  }

  const formattedPhone = formatPhone(tel);

  if (!isValidPhone(formattedPhone)) {
    throw new Error('Numéro de téléphone invalide.');
  }

  return formattedPhone;
}

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

function authResponse(user, message) {
  return {
    message,
    token: generateJWT(user),
    user: sanitizeUser(user),
  };
}

async function checkOTP(channel, tel, email, code) {
  if (channel === 'email') {
    return await verifyEmailOTP(email, code);
  }

  const status = await verifySmsOTP(tel, code);

  return status === 'approved';
}

// ENVOI OTP GENERIQUE

exports.sendOTP = async (req, res) => {
  const { tel, email, channel } = req.body;

  try {
    if (!validateChannel(channel)) {
      return res.status(400).json({
        error: "Canal invalide.",
      });
    }

    if (channel === "email") {
      if (!email) {
        return res.status(400).json({
          error: "Email requis.",
        });
      }

      await sendEmailOTP(email);
    } else {
      const formattedPhone = validatePhone(tel);
      await sendSmsOTP(formattedPhone);
    }

    return res.status(200).json({
      success: true,
      message: "Code envoyé.",
    });
  } catch (err) {
    console.error("sendOTP error:", err);

    return res.status(500).json({
      error: err.message || "Erreur lors de l'envoi du code.",
    });
  }
};

// ETAPE 1 : DEMARRER L'INSCRIPTION

exports.startRegistration = async (req, res) => {
  const {
    tel,
    email,
    username,
    channel,
  } = req.body;

  try {

    if (!validateChannel(channel)) {
      return res.status(400).json({
        error: 'Canal invalide.',
      });
    }

    const formattedPhone = validatePhone(tel);

    if (channel === 'email' && !email) {
      return res.status(400).json({
        error: 'Email requis.',
      });
    }

    // Vérifier téléphone
    const existingPhone = await User.findOne({
      where: {
        tel: formattedPhone,
      },
    });

    if (existingPhone) {
      return res.status(409).json({
        error: 'Ce numéro est déjà associé à un compte.',
      });
    }

    // Vérifier username
    if (username) {
      const existingUsername = await User.findOne({
        where: {
          username,
        },
      });

      if (existingUsername) {
        return res.status(409).json({
          error: "Nom d'utilisateur déjà utilisé.",
        });
      }
    }

    // Vérifier email
    if (email) {
      const existingEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (existingEmail) {
        return res.status(409).json({
          error: 'Email déjà utilisé.',
        });
      }
    }

    // Envoi OTP
    if (channel === 'email') {
      console.log("Envoi OTP à :", email);
      await sendEmailOTP(email);
      console.log("OTP envoyé");
    } else {
      await sendSmsOTP(formattedPhone);
    }

    return res.status(200).json({
      success: true,
      message: 'OTP envoyé avec succès.',
    });

  } catch (err) {
    console.error('startRegistration error:', err);

    return res.status(500).json({
      error: err.message || 'Erreur serveur.',
    });
  }
};

// ETAPE 2 : VERIFICATION OTP + CREATION COMPTE

exports.register = async (req, res) => {
  const {
    tel,
    email,
    nom,
    prenom,
    username,
    password,
    code,
    channel,
  } = req.body;

  try {

    if (!validateChannel(channel)) {
      return res.status(400).json({
        error: 'Canal invalide.',
      });
    }

    if (!code) {
      return res.status(400).json({
        error: 'Code OTP requis.',
      });
    }

    if (!password) {
      return res.status(400).json({
        error: 'Mot de passe requis.',
      });
    }

    const formattedPhone = validatePhone(tel);

    // Double vérification téléphone
    const existingUser = await User.findOne({
      where: {
        tel: formattedPhone,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Compte déjà existant.',
      });
    }

    // Double vérification email
    if (email) {
      const existingEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (existingEmail) {
        return res.status(409).json({
          error: 'Email déjà utilisé.',
        });
      }
    }

    // Vérification OTP
    const approved = await checkOTP(
      channel,
      formattedPhone,
      email,
      code
    );

    if (!approved) {
      return res.status(400).json({
        error: 'Code invalide ou expiré.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      username,
      tel: formattedPhone,
      email: email || null,
      password: hashedPassword,
    });

    return res.status(201).json(
      authResponse(
        user,
        'Compte créé avec succès.'
      )
    );

  } catch (err) {
    console.error('register error:', err);

    return res.status(500).json({
      error: err.message || 'Erreur serveur.',
    });
  }
};

// CONNEXION EMAIL/TEL + MOT DE PASSE

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'Identifiant et mot de passe requis.',
      });
    }

    let searchIdentifier = identifier;

    try {
      const formatted = formatPhone(identifier);

      if (isValidPhone(formatted)) {
        searchIdentifier = formatted;
      }
    } catch (_) {}

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { tel: searchIdentifier },
          { email: searchIdentifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Identifiants invalides.',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Identifiants invalides.',
      });
    }

    await user.update({
      last_login: new Date(),
    });

    return res.json(
      authResponse(
        user,
        'Connexion réussie.'
      )
    );

  } catch (err) {
    console.error('login error:', err);

    return res.status(500).json({
      error: 'Erreur serveur.',
    });
  }
};

exports.getRecentLogins = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: [
          "id",
          "nom",
          "prenom",
          "tel",
          "email",
          "last_login"
        ],

        order: [
          ["last_login", "DESC"]
        ],

        limit: 5

      });

      res.json(users);

    } catch (error) {
      console.error(error);
        res.status(500).json({
          message: "Erreur serveur"
        });
    }
};