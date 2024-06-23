const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken.js');

const { dietRequest, getUserDietRequest, deleteDietPlanRequest } = require('../../controllers/DietPlan/DietPlan.js');

router.post("/", verifyToken, dietRequest);
router.get("/", verifyToken, getUserDietRequest)
router.delete("/:dietPlanId", verifyToken, deleteDietPlanRequest)

module.exports = router;
