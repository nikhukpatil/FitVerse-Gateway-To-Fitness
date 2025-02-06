const DietPlan = require('../../models/DietPlan/DietPlan')
const USer = require('../../models/User/User')
const mongoose = require('mongoose');
const { createError } = require('../../error')
const { STATUS_CODES, STATUS_MESSAGES } = require('../../constants/Constant')

// To send a diet plan request
exports.dietRequest = async (req, res, next) => {
    try {
        const { height, weight, bmi, gender, dietPreference, dietGoal, exercise, sendInstructions, dietInstructions } = req.body;
        const { userId } = req.user;

        if (!height || !weight || !bmi || !gender || !dietPreference || !dietGoal || !exercise) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS))
        }

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }

        const user = await USer.findById(userId);
        const userName = user.fullName;

        const existingDietPlan = await DietPlan.findOne({ userId, responded: false });

        if (existingDietPlan) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: STATUS_MESSAGES.PENDING_RESPONSE });
        }


        const newDietPlan = new DietPlan({
            userId,
            height,
            weight,
            bmi,
            userName,
            gender,
            dietPreference,
            dietGoal,
            exercise,
            sendInstructions,
            dietInstructions
        });

        await newDietPlan.save();
        user.dietPlansRequested = (user.dietPlansRequested || 0) + 1;
        await user.save();

        res.status(STATUS_CODES.CREATED).json({ success: true, message: STATUS_MESSAGES.REQUEST_SENT })
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// To get user diet plan request
exports.getUserDietRequest = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { page = 1, limit = 5 } = req.query;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }

        const userDietReq = await DietPlan.find({ userId })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalDietReq = await DietPlan.countDocuments({ userId });
        const totalPages = Math.ceil(totalDietReq / limit);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            userDietReq,
            pagination: {
                totalDietReq,
                totalPages,
                currentPage: Number(page),
            },
        });
    } catch (error) {

        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// To delete diet plan request
exports.deleteDietPlanRequest = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { dietPlanId } = req.params;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }

        if (!dietPlanId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        if (!mongoose.Types.ObjectId.isValid(dietPlanId)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_ID));
        }

        const dietPlan = await DietPlan.findById(dietPlanId);

        const ifUserDietPlan = dietPlan.userId.toString();

        const user = await USer.findById(userId);

        if (ifUserDietPlan !== userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }

        await DietPlan.findByIdAndDelete(dietPlanId)
        user.dietPlansRequested = (user.dietPlansRequested || 0) - 1;
        await user.save();

        return res.status(STATUS_CODES.OK).json({ message: STATUS_MESSAGES.DELETED_SUCCESSFULLY });
    } catch (error) {

        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}
