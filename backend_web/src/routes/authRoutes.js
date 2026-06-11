// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.tel,
  message: { error: 'Trop de tentatives, réessaie dans 10 minutes.' },
});

router.post('/send-otp', otpLimiter, authController.sendOTP);
router.post('/register/verify', authController.register);
router.post('/login/verify', authController.login);

module.exports = router;