const express = require('express');
const router = express.Router();
const rateLimiter = require('../../middleware/ratelimiter.js')

const { getUser, saveBMI, deleteBMI, uploadAvatar, updateUser, changeEmailOTP, saveChangedEmail, changePassword, contactUs} = require('../../controllers/User/user.js');
const verifyToken = require('../../middleware/verifyToken.js');


router.get('/', verifyToken, getUser);
router.post('/', verifyToken, saveBMI);
router.delete('/:BMIId',verifyToken, deleteBMI);
router.post('/uploadavatar', rateLimiter.commonOperationsRouteRateLimiter, verifyToken, uploadAvatar);
router.patch('/', verifyToken, updateUser);
router.post('/change-email-otp', rateLimiter.commonOperationsRouteRateLimiter, verifyToken, changeEmailOTP);
router.post('/save-changed-email', rateLimiter.commonOperationsRouteRateLimiter, verifyToken, saveChangedEmail);
router.put('/change-password', rateLimiter.commonOperationsRouteRateLimiter, verifyToken, changePassword);
router.post('/contact-us', rateLimiter.commonOperationsRouteRateLimiter, verifyToken, contactUs);

module.exports = router;