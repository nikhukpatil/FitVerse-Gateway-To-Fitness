const express = require('express');
const router = express.Router();
const rateLimiter = require('../../middleware/ratelimiter.js')

const { signup, signin, verifyEmail, sendOTP, forgotPasswordWithEmail, resetPasswordOTP, resetPassword } = require('../../controllers/User/auth.js');

router.post('/sendotp', rateLimiter.otpRouteRateLimiter, sendOTP);
router.post('/verifyemail', rateLimiter.otpRouteRateLimiter, verifyEmail);
router.post('/signup', signup);
router.post('/signin', rateLimiter.loginRouteRateLimiter, signin);
router.post("/forgotPasswordWithEmail", forgotPasswordWithEmail);
router.post("/resetPasswordOTP", resetPasswordOTP);
router.post("/reset-password", resetPassword);


module.exports = router;
