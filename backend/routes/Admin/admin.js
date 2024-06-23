const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken.js');
const checkUser = require('../../middleware/checkUserRole.js');
const rateLimiter = require('../../middleware/ratelimiter.js')

const { signin, getAllBlogs, verifyBlog, rejectBlog, getAllDietPlanRequest, getDietPlanReqByID, sendDietPlan, getUserCount, getBlogCount, getDietPlanCount, getContact, respondToContact } = require('../../controllers/Admin/Admin.js')

router.post("/", rateLimiter.loginRouteRateLimiter, signin);
router.get('/getallblogs', verifyToken, checkUser.admin, getAllBlogs);
router.patch('/verifyblog/:blogID', verifyToken, checkUser.admin, verifyBlog);
router.patch('/rejectblog/:blogID', verifyToken, checkUser.admin, rejectBlog);
router.get('/getAllDietPlanRequest', verifyToken, checkUser.admin, getAllDietPlanRequest);
router.get('/getDietPlanReqByID/:id', verifyToken, checkUser.admin, getDietPlanReqByID);
router.post('/sendDietPlan/:id', verifyToken, checkUser.admin, sendDietPlan);
router.get('/getusercount', verifyToken, checkUser.admin, getUserCount);
router.get('/getblogcount', verifyToken, checkUser.admin, getBlogCount);
router.get('/getrequestcount', verifyToken, checkUser.admin, getDietPlanCount);
router.get('/getcontact', verifyToken, checkUser.admin, getContact);
router.patch('/contact/:id', respondToContact);


module.exports = router;