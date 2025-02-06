const emailjs = require('@emailjs/nodejs')
const { EMAILJS_PRIVATE_KEY, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } = require('../envVariables');


const generateOTPEmailTemplate = (email, otp) => ({
    to_email: email,
    otp: otp,
    subject: `Verification Code ${otp}.`,
    heading: `HI, YOU'RE ALMOST THERE!`,
    subHeading: 'Complete your registration using the verification code shown below.',
    message: 'Your OTP to verify your email is:'
});

const generateForgotPasswordEmailTemplate = (email, otp, fullName) => ({
    to_email: email,
    otp: otp,
    subject: 'Your Password Reset request for FitVerse',
    heading: `HI, ${fullName}!`,
    subHeading: `A password reset was requested for your ${email} FitVerse account.`,
    message: 'Your OTP to reset your password is:'
});

const sendEmail = async (emailContent) => {
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailContent, { publicKey: EMAILJS_PUBLIC_KEY, privateKey: EMAILJS_PRIVATE_KEY });
        return { success: true, message: 'Verification code sent' };
    } catch (error) {
        throw new Error('Internal Server Error');
    }
};

const sendOTPEmail = async (email, otp) => {
    const emailContent = generateOTPEmailTemplate(email, otp);
    return await sendEmail(emailContent);
};

const sendForgotPasswordEmail = async (email, otp, fullName) => {
    const emailContent = generateForgotPasswordEmailTemplate(email, otp, fullName);
    return await sendEmail(emailContent);
};

module.exports = { sendOTPEmail, sendForgotPasswordEmail };