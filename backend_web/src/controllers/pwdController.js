const { User } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {sendSmsOTP, verifySmsOTP} = require("../services/twilioService");
const { sendEmailOTP, verifyEmailOTP} = require("../services/brevoService");
const {formatPhone, isValidPhone} = require("../utils/formatPhone");


function generateResetJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      purpose: "password_reset",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

function validateChannel(channel) {
  return ["sms", "email"].includes(channel);
}

function validatePhone(tel) {
  if (!tel) {
    throw new Error("Numéro de téléphone requis.");
  }

  const formattedPhone = formatPhone(tel);

  if (!isValidPhone(formattedPhone)) {
    throw new Error("Numéro de téléphone invalide.");
  }

  return formattedPhone;
}

async function checkOTP(channel, tel, email, code) {

  if (channel === "email") {
    return await verifyEmailOTP(email, code);
  }

  const status = await verifySmsOTP(tel, code);

  return status === "approved";
}

exports.forgotPassword = async (req, res) => {

  const {
    identifier,
    channel,
  } = req.body;

  try {
    if (!identifier) {
      return res.status(400).json({
        error: "Identifiant requis.",
      });
    }

    if (!validateChannel(channel)) {
      return res.status(400).json({
        error: "Canal invalide.",
      });
    }

    let user;

    if (channel === "email") {

      user = await User.findOne({
        where: {
          email: identifier,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "Aucun compte associé à cet email.",
        });
      }
      
      await sendEmailOTP(user.email);

    } else {

      const formattedPhone = validatePhone(identifier);

      user = await User.findOne({
        where: {
          tel: formattedPhone,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "Aucun compte associé à ce numéro.",
        });
      }

      await sendSmsOTP(formattedPhone);
    }

    return res.status(200).json({
      success: true,
      message: "Code OTP envoyé.",
    });

  } catch (err) {

    console.error("forgotPassword error:", err);

    return res.status(500).json({
      error: err.message || "Erreur serveur.",
    });

  }

};

exports.verifyResetOTP = async (req, res) => {
  const {
    identifier,
    channel,
    code,
  } = req.body;

  try {

    if (!identifier || !code) {
      return res.status(400).json({
        error: "Identifiant et code OTP requis.",
      });
    }

    if (!validateChannel(channel)) {
      return res.status(400).json({
        error: "Canal invalide.",
      });
    }

    let user;
    let approved = false;

    if (channel === "email") {
      user = await User.findOne({
        where: {
          email: identifier,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "Compte introuvable.",
        });
      }

      approved = await checkOTP(
        "email",
        null,
        user.email,
        code
      );

      console.log("OTP approuvé :", approved);

    } else {

      const formattedPhone = validatePhone(identifier);

      user = await User.findOne({
        where: {
          tel: formattedPhone,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "Compte introuvable.",
        });
      }

      approved = await checkOTP(
        "sms",
        formattedPhone,
        null,
        code
      );

    }

    if (!approved) {
      return res.status(400).json({
        error: "Code OTP invalide ou expiré.",
      });
    }

    const resetToken = generateResetJWT(user);

    return res.status(200).json({
      success: true,
      message: "OTP vérifié.",
      resetToken,
    });

  } catch (err) {

    console.error("verifyResetOTP error:", err);

    return res.status(500).json({
      error: err.message || "Erreur serveur.",
    });

  }

};

// ======================================================
// ETAPE 3 : REINITIALISATION MOT DE PASSE
// ======================================================

exports.resetPassword = async (req, res) => {

  const {
    resetToken,
    password,
  } = req.body;

  try {

    if (!resetToken) {
      return res.status(400).json({
        error: "Token de réinitialisation requis.",
      });
    }

    if (!password) {
      return res.status(400).json({
        error: "Nouveau mot de passe requis.",
      });
    }

    let payload;

    try {

      payload = jwt.verify(
        resetToken,
        process.env.JWT_SECRET
      );

    } catch (err) {

      return res.status(401).json({
        error: "Token invalide ou expiré.",
      });

    }

    if (payload.purpose !== "password_reset") {
      return res.status(403).json({
        error: "Token invalide.",
      });
    }

    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(404).json({
        error: "Utilisateur introuvable.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Mot de passe modifié avec succès.",
    });

  } catch (err) {

    console.error("resetPassword error:", err);

    return res.status(500).json({
      error: err.message || "Erreur serveur.",
    });

  }

};