
const User = require('../../models/User/User.js');
const Blog = require('../../models/Blogs/Blog.js')
const DietPlan = require('../../models/DietPlan/DietPlan.js');
const Contact = require("../../models/Contact/Contact.js")
const { generateAuthToken } = require('../../helpers/generateAuthToken.js');
const { createError } = require('../../error.js');
const { STATUS_CODES, STATUS_MESSAGES, VALIDATIONS } = require('../../constants/Constant.js');

// For Admin signin
exports.signin = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_EMAIL_FORMAT));
        }

        let user = null;

        user = await User.findOne({ email: email }).select("email password role");

        if (!user || !(await user.checkCorrectPassword(password))) {
            return next(createError(STATUS_CODES.INVALID_CODE, STATUS_MESSAGES.INVALID_CREDENTIALS));
        }

        if (user.role !== 'Admin') {
            return next(createError(STATUS_CODES.UNAUTHORIZED, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }

        const token = generateAuthToken(user);

        return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.LOGIN_SUCCESSFUL, token: `Bearer ${token}` });


    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// To get all the blogs
exports.getAllBlogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        const skip = (pageInt - 1) * limitInt;
        const totalBlogs = await Blog.countDocuments();
        const totalPages = Math.ceil(totalBlogs / limitInt);

        const blogs = await Blog.find()
            .skip(skip)
            .limit(limitInt)
            .lean();

        return res.status(STATUS_CODES.OK).json({ success: true, blogs, currentPage: pageInt, totalPages });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
};

// To verify the user blog
exports.verifyBlog = async (req, res, next) => {
    try {
        const { blogID } = req.params;
        if (!blogID) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        const blog = await Blog.findById(blogID).lean();
        if (!blog) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.BLOG_NOT_FOUND));
        }

        if (blog.status === 'Verified') {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.ALREADY_VERIFIED));
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogID,
            { status: 'Verified', rejectionMessage: null },
            { new: true }
        ).lean();

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: STATUS_MESSAGES.VERIFIED_SUCCESSFULLY,
            blog: updatedBlog,
        });
    } catch (error) {
        console.error(error);
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
};

// To reject a user blog
exports.rejectBlog = async (req, res, next) => {
    try {
        const { blogID } = req.params;
        const { rejectionMessage } = req.body;
        if (!blogID || !rejectionMessage) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        const blog = await Blog.findById(blogID).lean();
        if (!blog) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.BLOG_NOT_FOUND));
        }

        if (blog.status === 'Rejected') {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.ALREADY_REJECTED));
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogID,
            { status: 'Rejected', rejectionMessage },
            { new: true }
        ).lean();

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: STATUS_MESSAGES.REJECTED_SUCCESSFULLY,
            blog: updatedBlog,
        });
    } catch (error) {
        console.error(error);
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
};

// To get all the diet plans request
exports.getAllDietPlanRequest = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        const skip = (pageInt - 1) * limitInt;
        const totalBlogs = await DietPlan.countDocuments();
        const totalPages = Math.ceil(totalBlogs / limitInt);

        const dietPlans = await DietPlan.find().skip(skip).limit(limitInt).lean();

        return res.status(STATUS_CODES.OK).json({ success: true, dietPlans, currentPage: pageInt, totalPages });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// To get a diet plan request by id
exports.getDietPlanReqByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id){
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }
        const dietPlan = await DietPlan.findById(id).lean();
        if(!dietPlan){
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.DATA_NOT_FOUND));
        }
        return res.status(STATUS_CODES.OK).json({success: true, dietPlan});
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

//  send response to the user with diet plan
exports.sendDietPlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { dietInstructions } = req.body;

        if(!dietInstructions) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        if(!id){
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        const dietPlan = await DietPlan.findById(id).lean();
        if(!dietPlan){
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.DATA_NOT_FOUND));
        }

        const updatedDietPlan = await DietPlan.findByIdAndUpdate(
            id,
            {
                dietInstructions,
                responded: true
            },
            { new: true }
        );

        return res.status(STATUS_CODES.OK).json({success: true, updatedDietPlan, message: STATUS_MESSAGES.SAVE_SUCCESSFUL})
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// To get the count of user
exports.getUserCount = async (req, res, next) => {
    try {
        const totalUser = await User.countDocuments();
        const currentDate = new Date();

        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);

        const newUserMonth = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

        const newUserWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });


        return res.status(STATUS_CODES.OK).json({success: true, totalUser, newUserMonth, newUserWeek});
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// To get the count of blog
exports.getBlogCount = async (req, res, next) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const verifiedBlogs = await Blog.countDocuments({ status: 'Verified' });
        const pendingBlogs = await Blog.countDocuments({ status: 'Pending' });
        const rejectedBlogs = await Blog.countDocuments({ status: 'Rejected' });

        return res.status(STATUS_CODES.OK).json({success: true, totalBlogs, verifiedBlogs, pendingBlogs, rejectedBlogs});

    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// to get the count of Diet Plans requests
exports.getDietPlanCount = async (req, res, next) => {
    try {
        const totalRequest = await DietPlan.countDocuments();
        const respondedRequest = await DietPlan.countDocuments({ responded: true });
        const pendingRequest = await DietPlan.countDocuments({ responded: false });

        return res.status(STATUS_CODES.OK).json({success: true, totalRequest, respondedRequest, pendingRequest});
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// To get all the contact request
exports.getContact = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        const skip = (pageInt - 1) * limitInt;
        const totalcontact = await Contact.countDocuments();
        const totalPages = Math.ceil(totalcontact / limitInt);

        const contact = await Contact.find()
            .skip(skip)
            .limit(limitInt)
            .lean();

        return res.status(STATUS_CODES.OK).json({ success: true, contact, currentPage: pageInt, totalPages });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// To mark the contact as true
exports.respondToContact = async (req, res, next) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findById(id);

        if (!contact) {
            return next(createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.DATA_NOT_FOUND));
        }

        if (contact.responded) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.ALREADY_RESPONDED));
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { responded: true },
            { new: true, runValidators: true }
        );

        return res.status(STATUS_CODES.OK).json({ success: true, contact: updatedContact });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
};