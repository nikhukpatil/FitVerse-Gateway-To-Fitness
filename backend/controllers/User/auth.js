const mongoose = require('mongoose');
const crypto = require('crypto')
const User = require('../../models/User/User.js');
const VerifiedUser = require('../../models/User/verifiedUser.js');
const { generateAuthToken } = require('../../helpers/generateAuthToken.js');
const { createError } = require('../../error.js');
const { STATUS_CODES, STATUS_MESSAGES, VALIDATIONS } = require('../../constants/Constant.js');
const { sendOTPEmail, sendForgotPasswordEmail } = require('../../helpers/emailTemplate.js')
const { SMS_KEY } = require('../../envVariables.js');

// To send otp to email
exports.sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }
        if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_EMAIL_FORMAT));
        }
        const user = await User.findOne({ email: email });
        if (user) {
            return next(createError(STATUS_CODES.CONFLICT, STATUS_MESSAGES.EMAIL_ALREADY_EXIST))
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const ttl = 5 * 60 * 1000;
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`;
        const hash = crypto.createHmac('sha256', SMS_KEY).update(data).digest('hex');
        const resetHash = `${hash}.${expires}`;

        try {
            await sendOTPEmail(email, otp);
            return res.status(STATUS_CODES.OK).json({ success: true, resetHash, message: STATUS_MESSAGES.VERIFICATION_CODE_SENT });
        } catch (error) {
            return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
        }
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
};

// To verify the email
exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, otp, resetHash } = req.body;
        if (!email || !otp || !resetHash) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        const [hash, expires] = resetHash.split('.');
        const now = Date.now();

        if (now > parseInt(expires) || !hash) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.OTP_EXPIRED))
        }

        const data = `${email}.${otp}.${expires}`;
        const computedHash = crypto.createHmac('sha256', SMS_KEY).update(data).digest('hex');

        if (computedHash === hash) {
            const verifiedEmail = await VerifiedUser.findOne({ email: email });
            if (verifiedEmail) {
                return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.OTP_VERIFIED })
            } else {
                const verifiedEmail = new VerifiedUser({
                    email
                })
                await verifiedEmail.save();
                return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.OTP_VERIFIED })
            }
        }
        else {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.OTP_EXPIRED))
        }


    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// Signup
exports.signup = async (req, res, next) => {
    try {
        const { fullName, email, phone, password, confirmPassword } = req.body;

        if (!fullName || !email || !password || !confirmPassword) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        if (password !== confirmPassword) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.PASSWORDS_NOT_MATCH));
        }

        if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_EMAIL_FORMAT));
        }

        const verifiedEmail = await VerifiedUser.findOne({ email });
        if (!verifiedEmail) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.EMAIL_NOT_VERIFIED));
        }

        let mobileNumber = null;
        if (phone) {
            if (!VALIDATIONS.PHONE_REGEX_VALIDATION.test(phone)) {
                return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_PHONE_FORMAT));
            }
            mobileNumber = '+91' + phone;
            const existingPhoneUser = await User.findOne({ phone: mobileNumber });
            if (existingPhoneUser) {
                return next(createError(STATUS_CODES.CONFLICT, STATUS_MESSAGES.NUMBER_ALREADY_EXIST));
            }
        }

        const user = await User.findOne({ email: email });
        if (user) {
            return next(createError(STATUS_CODES.CONFLICT, STATUS_MESSAGES.EMAIL_ALREADY_EXIST));
        }

        let newUser = new User({
            fullName,
            email: email,
            phone: mobileNumber,
            password
        })

        await newUser.save();

        return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.SIGNUP_SUCCESSFUL })

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Handle Mongoose validation error
            const errors = Object.values(err.errors).map((el) => el.message);
            return next(createError(400, errors.join(". ")));
        }
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));

    }
}

// Signin
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

        user = await User.findOne({ email: email }).select("email password");

        if (!user || !(await user.checkCorrectPassword(password))) {
            return next(createError(STATUS_CODES.INVALID_CODE, STATUS_MESSAGES.INVALID_CREDENTIALS));
        }
        const token = generateAuthToken(user);

        return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.LOGIN_SUCCESSFUL, token: `Bearer ${token}` });


    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// to find and send a otp to user if exist
exports.forgotPasswordWithEmail = async (req, res, next) => {
   
    try {
        let { email } = req.body;

        if (!email) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }
        if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_EMAIL_FORMAT));
        }

        const isUser = await User.findOne({ email });
        if (isUser == null) return res.status(STATUS_CODES.BAD_REQUEST).json({ message: STATUS_MESSAGES.USER_NOT_FOUND });
        const fullName = isUser.fullName
       

        const otp = Math.floor(100000 + Math.random() * 900000);
        const ttl = 5 * 60 * 1000;
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`;
        const hash = crypto.createHmac('sha256', SMS_KEY).update(data).digest('hex');
        const resetHash = `${hash}.${expires}`;

        try {
            await sendForgotPasswordEmail(email, otp, fullName);
            return res.status(STATUS_CODES.OK).json({ success: true, resetHash, message: STATUS_MESSAGES.VERIFICATION_CODE_SENT });
        } catch (error) {
            return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
        }


    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// To rverify the otp
exports.resetPasswordOTP = async (req, res, next) => {
   
    try {
        const { email, otp, resetHash } = req.body;
        if (!email || !otp || !resetHash) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }
        if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_EMAIL_FORMAT));
        }

        const [hash, expires] = resetHash.split('.');
        const now = Date.now();

        if (now > parseInt(expires) || !hash) {
           
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.OTP_EXPIRED))
        }

        const data = `${email}.${otp}.${expires}`;
        const computedHash = crypto.createHmac('sha256', SMS_KEY).update(data).digest('hex');
        if (computedHash === hash) {
            const user = await User.findOne({ email });
            var token = await user.getResetPasswordToken();
            res.status(STATUS_CODES.OK).json({ message: STATUS_MESSAGES.OTP_VERIFIED, resetPasswordToken: token });
        } else {
            return next(createError(STATUS_MESSAGES.BAD_REQUEST, STATUS_MESSAGES.OTP_EXPIRED))
        }
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// To reset the password
exports.resetPassword = async (req, res, next) => {
    try {


        const { password, confirmPassword, resetPasswordToken } = req.body;

        if (!password || !confirmPassword) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }

        if (password !== confirmPassword) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.PASSWORDS_NOT_MATCH));
        }

        if (!resetPasswordToken) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }

        const user = await User.findOne({
            resetPasswordToken: crypto
                .createHash('sha256')
                .update(resetPasswordToken)
                .digest('hex'),
            resetPasswordExpire: { $gt: new Date() }
        });

        if (!user) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }

        user.password = password;
        await user.save();

        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();

        return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.PASSWORD_UPDATED });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}