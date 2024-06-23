const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    blogImage: {
        url: {
            type: String,
        },
        filePath: {
            type: String,
        }
    },
    blogContent: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    clickCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending',
        required: true,
    },
    rejectionMessage: {
        type: String
    },
    authorType: {
        type: String,
        required: true,
    }
})


const Blog = mongoose.model('blogs', BlogSchema);
module.exports = Blog;