const User = require('../../models/User/User.js');
const Contact = require('../../models/Contact/Contact.js')
const crypto = require('crypto')
const emailjs = require('@emailjs/nodejs')
const { STATUS_CODES, STATUS_MESSAGES, VALIDATIONS } = require('../../constants/Constant.js');
const { createError } = require('../../error.js')
const { uploadImage, deleteImage } = require('../../utils/firebaseImage.js')
const { generateAuthToken } = require('../../helpers/generateAuthToken.js');
const { EMAILJS_PRIVATE_KEY, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, SMS_KEY } = require('../../envVariables.js');

//for getting the current user
exports.getUser = async (req, res, next) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }

        let user = await User.findById(userId).select("-password").lean();

        if (!user) {
            return next(createError(STATUS_CODES.INVALID_CODE, STATUS_MESSAGES.USER_NOT_FOUND));
        }
        const token = generateAuthToken(user);
        res.status(STATUS_CODES.OK).json({
            success: true, token: `Bearer ${token}`,
            user: {
                _id: user.id,
                fullName: user.fullName,
                avatar: user.avatar,
                email: user.email,
                phone: user.phone,
                BMIs: user.BMIs,
                userAvatar: user.userAvatar,
                role: user.role,
                createdAt: user.createdAt,
                blogsCreated: user.blogsCreated,
                dietPlansRequested: user.dietPlansRequested

            }
        });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

//Save the BMIData
exports.saveBMI = async (req, res, next) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }
        let { height, weight, BMI } = req.body;
        if (!height || !weight || !BMI) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS));
        }
        let user = await User.findById(userId);

        if (!user) {
            return next(createError(STATUS_CODES.INVALID_CODE, STATUS_MESSAGES.USER_NOT_FOUND));
        }

        const BMIData = { height, weight, BMI };

        user.BMIs.push(BMIData)
        if (user.BMIs.length > 5) {
            user.BMIs = user.BMIs.slice(-5);
        }

        await user.save();

        return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.SAVE_SUCCESSFUL })
    }
    catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }

}

// Delete the selected BMIData
exports.deleteBMI = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { BMIId } = req.params;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }

        if (!BMIId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS))
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { BMIs: { _id: BMIId } } },
            { new: true }
        );

        if (!user) {
            return next(createError(STATUS_CODES.INVALID_CODE, STATUS_MESSAGES.USER_NOT_FOUND));
        }

        return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.DELETE_SUCCESSFUL, user })

    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// Upload the user avatar
exports.uploadAvatar = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { image } = req.body;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }

        if (!image) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS))
        }

        const user = await User.findById(userId);
        if (user?.userAvatar?.filePath) {
            await deleteImage(user.userAvatar.filePath);
        }

        const { url, filePath } = await uploadImage(userId, image, 'avatar');

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'userAvatar.url': url,
                    'userAvatar.filePath': filePath,
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return next(createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.USER_NOT_FOUND));
        }

        return res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.IMAGE_UPLOADED, user: updatedUser });
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

// For updating name and phone
exports.updateUser = async (req, res, next) => {
    try {
        const { userId } = req.user
        const { fullName, phone } = req.body;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }
        if (!fullName && !phone) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS))
        }

        const updateFields = {};
        const updatedFields = [];

        if (fullName) {
            updateFields.fullName = fullName;
            updatedFields.push('Name');
        }
        if (phone) {
            // for checking phonenumber validation
            if (!VALIDATIONS.PHONE_REGEX_VALIDATION.test(phone)) {
                return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_PHONE_FORMAT));
            }

            // for checking if phone already exist
            mobileNumber = '+91' + phone;
            const existingPhoneUser = await User.findOne({ phone: mobileNumber });
            if (existingPhoneUser) {
                return next(createError(STATUS_CODES.CONFLICT, STATUS_MESSAGES.NUMBER_ALREADY_EXIST));
            }

            updateFields.phone = mobileNumber;
            updatedFields.push('Phone Number');
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        );

        return res.status(STATUS_CODES.OK).json({ success: true, message: `${updatedFields.join(', ')} ` + STATUS_MESSAGES.UPDATED_SUCCESSFULLY, user })
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR))
    }
}

//  for sending OTP to new and old email address
exports.changeEmailOTP = async (req, res, next) => {
    try {
        const { userId } = req.user

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }

        const { email } = req.body

        if (!email) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS))
        }

        if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_EMAIL_FORMAT));
        }

        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return next(createError(STATUS_CODES.CONFLICT, STATUS_MESSAGES.EMAIL_ALREADY_EXIST));
        }

        const user = await User.findById(userId).select('email');

        if (!user) {
            return next(createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.USER_NOT_FOUND));
        }

        const oldEmail = user.email;

        const otp1 = Math.floor(100000 + Math.random() * 900000);
        const otp2 = Math.floor(100000 + Math.random() * 900000);
        const ttl = 5 * 60 * 1000;
        const expires = Date.now() + ttl;
        const data = `${email}.${oldEmail}.${otp1}.${otp2}.${expires}`;
        const hash = crypto.createHmac('sha256', SMS_KEY).update(data).digest('hex');
        const resetHash = `${hash}.${expires}`;

        const templateParamsNewEmail = {
            subject: 'OTP',
            to_email: email,
            otp: otp2,
            message: STATUS_MESSAGES.NEW_EMAIL_MESSAGE,
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParamsNewEmail, {
            publicKey: EMAILJS_PUBLIC_KEY,
            privateKey: EMAILJS_PRIVATE_KEY,
        });

        const templateParamsOldEmail = {
            subject: 'OTP',
            to_email: oldEmail,
            otp: otp1,
            message: STATUS_MESSAGES.OLD_EMAIL_MESSAGE,
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParamsOldEmail, {
            publicKey: EMAILJS_PUBLIC_KEY,
            privateKey: EMAILJS_PRIVATE_KEY,
        });

        res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.VERIFICATION_CODE_SENT + ` ${email} and ${oldEmail}`, resetHash, otp1, otp2 })

    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// for verifying OTP from both email addresses
exports.saveChangedEmail = async (req, res, next) => {
    try {
        const { userId } = req.user

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }
        const { email, otp, newEmailOTP, resetHash } = req.body;

        if (!email || !otp || !newEmailOTP || !resetHash) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS))
        }

        if (!VALIDATIONS.EMAIL_REGEX_VALIDATION.test(email)) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_EMAIL_FORMAT));
        }

        if (!resetHash) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST))
        }

        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return next(createError(STATUS_CODES.CONFLICT, STATUS_MESSAGES.EMAIL_ALREADY_EXIST));
        }

        const user = await User.findById(userId).select('email');

        if (!user) {
            return next(createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.USER_NOT_FOUND));
        }

        const oldEmail = user.email;

        const [hash, expires] = resetHash.split('.');
        const now = Date.now();

        if (now > parseInt(expires) || !hash) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.OTP_EXPIRED));
        }

        const data = `${email}.${oldEmail}.${otp}.${newEmailOTP}.${expires}`;
        const computedHash = crypto.createHmac('sha256', SMS_KEY).update(data).digest('hex');

        if (computedHash !== hash) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.OTP_EXPIRED));
        }

        await User.findByIdAndUpdate(userId, { $set: { email: email } });

        res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.UPDATED_SUCCESSFULLY, user });

    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// for changing the signin password
exports.changePassword = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS))

        if (newPassword !== confirmPassword) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.PASSWORDS_NOT_MATCH));
        }
        const user = await User.findOne({ _id: userId })

        if (!user) {
            return next(createError(STATUS_CODES.NOT_FOUND, STATUS_MESSAGES.USER_NOT_FOUND));
        }


        const checkPassword = await user.checkCorrectPassword(oldPassword);

        if (!checkPassword) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.INVALID_CREDENTIALS));
        } else {
            user.password = newPassword;
            const updatedUser = await user.save();


            if (updatedUser) {
                res.status(STATUS_CODES.OK).json({
                    success: true,
                    message: STATUS_MESSAGES.UPDATED_SUCCESSFULLY,
                    user: updatedUser
                });
            } else {
                return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.PASSWORD_UPDATE_ERROR));
            }
        }

    } catch (err) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

// for submitting the contact us form
exports.contactUs = async (req, res, next) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.UNAUTHORIZED_REQUEST));
        }
        const { name, email, phone, subject, message } = req.body;

        if(!name || !email || !phone || !subject || !message){
            return next(createError(STATUS_CODES.BAD_REQUEST, STATUS_MESSAGES.REQUIRED_DETAILS))
        }

        const newContact = new Contact({
            userId,
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();


        res.status(STATUS_CODES.OK).json({ success: true, message: STATUS_MESSAGES.FORM_SUBMITTED_SUCCESSFULL})
    } catch (error) {
        return next(createError(STATUS_CODES.SERVER_ERROR, STATUS_MESSAGES.INTERNAL_SERVER_ERROR));
    }
}

