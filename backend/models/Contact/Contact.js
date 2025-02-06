const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    responded: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;