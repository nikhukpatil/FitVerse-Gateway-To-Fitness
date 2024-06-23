const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken.js');
const rateLimiter = require('../../middleware/ratelimiter.js')

const { createBlog, getAllVerifiedBlogs, deleteBlog, getVerifiedBlogById, popularBlogs, randomBlogs, getUserBlogs, getBlogById, updateBlog, clickCount} = require('../../controllers/Blog/blog')

router.post("/", verifyToken, createBlog);
router.delete("/:blogID", verifyToken, deleteBlog);
router.put("/:blogID", rateLimiter.commonOperationsRouteRateLimiter, verifyToken, updateBlog);
router.get("/getUserBlogs", verifyToken, getUserBlogs);

router.get("/", getAllVerifiedBlogs);
router.get("/getVerifiedBlogById/:blogID", getVerifiedBlogById);
router.get("/getBlogById/:blogID", getBlogById);
router.post("/clickCount/:blogID", clickCount);
router.get("/popularBlogs", popularBlogs);
router.get("/randomBlogs", randomBlogs);



module.exports = router;