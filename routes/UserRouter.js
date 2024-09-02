const express = require('express');
const router = express.Router();
const twilioService = require('../controllers/TwilioSmsService.js');
const userController = require('../controllers/UserController.js')

router.post('/signup',userController.createUser);
router.post('/login',userController.login);
router.post('/otp/verify',twilioService.verifyOTP)

module.exports = router;