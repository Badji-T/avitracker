// routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const verifyToken = require('../middlewares/authMiddleware');
const verifyRoles = require('../middlewares/roleMiddleware');
const {forgotPassword, verifyResetOTP, resetPassword} = require("../controllers/pwdController");
const { ipKeyGenerator } = require('express-rate-limit');

const router = express.Router();

// Limiteur OTP
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  keyGenerator: (req) => req.body.tel || ipKeyGenerator(req),
  message: {
    error: 'Trop de tentatives. Réessayez dans 10 minutes.'
  }
});

// Limiteur connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.body.tel || ipKeyGenerator(req),
  message: {
    error: 'Trop de tentatives de connexion.'
  }
});

//Recuperation des informations et envoi OTP (SMS ou Email)
router.post('/startRegistration', otpLimiter, authController.startRegistration);

// Verification OTP 
router.post('/send-otp', otpLimiter, authController.sendOTP);

// Inscription après vérification OTP
router.post('/register/verify', authController.register);

// Connexion après vérification OTP
router.post('/login/verify', loginLimiter, authController.login  );

//Verification du role de l'utilisateur
router.get('/verify-role', verifyToken, verifyRoles('admin'), (req, res) => {
        res.status(200).json({
            success: true,
            user: req.user
        });
    });

router.post("/forgot-password", otpLimiter, forgotPassword);

router.post("/verify-reset-otp", verifyResetOTP);

router.post("/reset-password", resetPassword);

router.get(
    "/recent-logins",
    verifyToken,
    authController.getRecentLogins
);

module.exports = router;