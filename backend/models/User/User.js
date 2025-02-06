  const mongoose = require("mongoose");
  const { Schema } = mongoose;
  const bcrypt = require("bcryptjs");
  const crypto = require("crypto");
  const validator = require("validator");

  const BMISchema = new Schema({
      height: {
          type: Number,
          required: [true, "Please provide height"]
      },
      weight: {
          type: Number,
          required: [true, "Please provide weight"]
      },
      BMI: {
          type: String,
          required: [true, "Please provide BMI"]
      },
      date: {
          type: Date,
          default: Date.now
      }
  });

  const UserSchema = new Schema(
    {
      fullName: {
        type: String,
        required: [true, "Please provide your full name"],
      },
      email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
      },
      phone: {
        type: String,
        sparse: true
      },
      password: {
        type: String,
        required: [true, "Please provide your password"],
        minlength: [8, "Password must be at least 8 characters long"],
        validate: [validator.isStrongPassword, "Password must be strong"],
      },
      role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
        required: true
      },
      BMIs: [BMISchema],
      userAvatar : {
        url: {
          type: String,
        },
        filePath: {
          type: String,
        }
      },
      blogsCreated: {
        type: Number,
        default: 0
      },
      dietPlansRequested: {
        type: Number,
        default: 0
      },
      resetPasswordToken: { type: String },
      resetPasswordExpire: { type: Date },
    },
    { timestamps: true }
  );

  UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  UserSchema.methods.checkCorrectPassword = async function (prevPassword) {
    return await bcrypt.compare(prevPassword, this.password);
  };

  // Generate password token
  UserSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);

    await this.save();

    return resetToken;
  };

  const User = mongoose.model("users", UserSchema);
  module.exports = User;
