const express = require('express');
const statsController = require('../controllers/statsController');
const router = express.Router();

router.get( "/registrations", statsController.getRegistrationsByMonth );
router.get( "/statistics", statsController.getRegistrationsAndLogins);

module.exports = router;