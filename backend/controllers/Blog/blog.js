const Blog = require('../../models/Blogs/Blog.js')
const User = require('../../models/User/User.js')
const mongoose = require("mongoose");
const { STATUS_CODES, STATUS_MESSAGES } = require('../../constants/Constant.js');
const { createError } = require('../../error.js')
const { uploadBlogImage, deleteImage } = require('../../utils/firebaseImage.js')

// To create a new blog
exports.createBlog = async (req, res, next) => {
    try {
        const { userId } = req.user;

        let status = 'Verified';
        let authorType = 'Admin';

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.USER_TOKEN_NOTFOUND));
        }
        const user = await User.findById(userId);
        const userName = user.fullName

        if (!user) {
            return next(createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.USER_NOT_FOUND));
        }

        if (user.role === 'User') {
            status = 'Pending';
            authorType = 'User';
        }


        const { title, blogImage, blogContent, summary } = req.body;

        if (!title || !blogImage || !blogContent || !summary) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        const { url, filePath } = await uploadBlogImage(userId, blogImage, 'blogImages', 'blog')

        const newBlog = new Blog({
            userId,
            userName,
            title,
            summary,
            blogImage: {
                url,
                filePath
            },
            blogContent,
            status,
            authorType,
        });

        await newBlog.save();
        user.blogsCreated = (user.blogsCreated || 0) + 1;
        await user.save();

        return res.status(STATUS_CODES.OK).json({ message: STATUS_MESSAGES.BLOG_CREATED });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
};

// to get all the verified blog
exports.getAllVerifiedBlogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        const skip = (pageInt - 1) * limitInt;
        const totalBlogs = await Blog.countDocuments({status: "Verified"});
        const totalPages = Math.ceil(totalBlogs / limitInt);

        const blogs = await Blog.find({status: "Verified"})
            .skip(skip)
            .limit(limitInt)
            .lean();

        return res.status(200).json({
            message: "success",
            blogs,
            currentPage: pageInt,
            totalPages,
        });
    } catch (error) {
        return next(createError(500, "Internal Server Error"));
    }
};

// to get a blog by id
exports.getBlogById = async (req, res, next) => {
    try {
        const { blogID } = req.params;
        if (!blogID) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }
        if (!mongoose.Types.ObjectId.isValid(blogID)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_ID));
        }
        const blog = await Blog.findOne({ _id: blogID }).lean();
        return res.status(STATUS_CODES.OK).json({ message: "success", blog });
    } catch (error) {
        
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// To increase a clickcount of a particular blog
exports.clickCount = async (req, res, next) => {
    try {
        const { blogID } = req.params;
        if (!blogID) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }
        if (!mongoose.Types.ObjectId.isValid(blogID)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_ID));
        }
        const blog = await Blog.findOneAndUpdate(
            { _id: blogID },
            { $inc: { clickCount: 1 } },
            { new: true, lean: true }
        );

        if (!blog) {
            return next(createError(404, 'Blog not found.'));
        }
        return res.status(STATUS_CODES.OK).json({ message: "success" });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// to get a verified blog by id
exports.getVerifiedBlogById = async (req, res, next) => {
    try {
        const { blogID } = req.params;
        if (!blogID) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }
        if (!mongoose.Types.ObjectId.isValid(blogID)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_ID));
        }
        const blog = await Blog.findOne({ _id: blogID }).lean();
        return res.status(STATUS_CODES.OK).json({ message: "success", blog });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// To delete a blog
exports.deleteBlog = async (req, res, next) => {
    try {
        const { blogID } = req.params;
        const { userId } = req.user;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }


        if (!blogID) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        if (!mongoose.Types.ObjectId.isValid(blogID)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_ID));
        }


        const blog = await Blog.findById(blogID);

        const ifUserBlog = blog.userId.toString();

        const user = await User.findById(userId);

        if (ifUserBlog !== userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }

        if (!blog) {
            return next(createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.BLOG_NOT_FOUND));
        }

        if (blog.blogImage && blog.blogImage.filePath) {
            await deleteImage(blog.blogImage.filePath);
        }

        await Blog.findByIdAndDelete(blogID);
        user.blogsCreated = (user.blogsCreated || 0) - 1;
        await user.save();

        return res.status(STATUS_CODES.OK).json({ message: STATUS_MESSAGES.DELETED_SUCCESSFULLY });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
};

// To get popular blog
exports.popularBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({ status: 'Verified' }).sort({ clickCount: -1 }).limit(3);

        return res.status(STATUS_CODES.OK).json({ success: true, blogs })
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
};

// To get random blog
exports.randomBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.aggregate([{ $match: { status: 'Verified' } }, { $sample: { size: 3 } }]);

        return res.status(STATUS_CODES.OK).json({ success: true, blogs })

    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
};

// Get users blog
exports.getUserBlogs = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { page = 1, limit = 5 } = req.query;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }

        const userBlogs = await Blog.find({ userId })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalBlogs = await Blog.countDocuments({ userId });
        const totalPages = Math.ceil(totalBlogs / limit);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            userBlogs,
            pagination: {
                totalBlogs,
                totalPages,
                currentPage: Number(page),
            },
        });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// To update a blog
exports.updateBlog = async (req, res, next) => {
    try {
        const { title, summary, blogContent, blogImage } = req.body;
        const { userId } = req.user;
        const { blogID } = req.params;

        const existingBlog = await Blog.findById(blogID);
        if (!existingBlog) {
            return next(createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.BLOG_NOT_FOUND));
        }

        if (existingBlog.userId.toString() !== userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }

        if( existingBlog.status == "Pending"){
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.IS_PENDING));
        }

        let updatedImageUrl = existingBlog.blogImage.url;
        let updatedImagePath = existingBlog.blogImage.filePath;

        if (blogImage && blogImage !== existingBlog.blogImage.url) {
            const { url, filePath } = await uploadBlogImage(userId, blogImage, 'blogImages', 'blog');
            updatedImageUrl = url;
            updatedImagePath = filePath;

            // Delete the old image file
            await deleteImage(existingBlog.blogImage.filePath);
        }

        // Update only the fields that are provided
        if (title) {
            existingBlog.title = title;
        }
        if (summary) {
            existingBlog.summary = summary;
        }
        if (blogContent) {
            existingBlog.blogContent = blogContent;
        }
        if (blogImage) {
            existingBlog.blogImage = {
                url: updatedImageUrl,
                filePath: updatedImagePath
            };
        }

        existingBlog.status = 'Pending';

        await existingBlog.save();

        return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.UPDATED_SUCCESSFULLY, existingBlog });

    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}