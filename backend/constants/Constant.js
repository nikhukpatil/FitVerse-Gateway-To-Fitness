const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
  CREATED: 201,
  REQ_DATING_ERROR_CODE: 204,
  INVALID_CODE: 401,
  FORBIDDEN_CODE: 403,
  INACTIVATE: 406,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

const STATUS_MESSAGES = {
  REQUIRED_DETAILS: "Please fill all the necessary details!",
  UNAUTHORIZED_REQUEST: "You are not authorized to perform this request!",
  USER_NOT_FOUND: "User not found",
  INVALID_EMAIL_FORMAT: "Please provide valid email!",
  INVALID_PHONE_FORMAT: "Please provide a valid 10 digit phone number!",
  EMAIL_ALREADY_EXIST: "Email address already in use!",
  NUMBER_ALREADY_EXIST: "Phone number already in use!",
  PASSWORDS_NOT_MATCH: "Plese check the password and confirm password!",
  SIGNUP_SUCCESSFUL: 'Signup successful',
  INTERNAL_SERVER_ERROR: 'Internal server error!',
  VERIFICATION_CODE_SENT: 'Verification code sent',
  OTP_EXPIRED: 'OTP has expired or is invalid',
  EMAIL_NOT_VERIFIED: 'Please verify your Email address first',
  OTP_VERIFIED: 'verified successfully',
  INVALID_CREDENTIALS: "Invalid Credentials!",
  INVALID_EMAIL_PHONE_FORMAT: "Invalid email or phone!",
  LOGIN_SUCCESSFUL: "Login Successfully.",
  USER_TOKEN_NOTFOUND: 'You are not logged in, Login now',
  USER_TOKEN_INVALID: 'Your session is expired, Login again',
  SAVE_SUCCESSFUL: 'Save successfully',
  DELETE_SUCCESSFUL: 'Deleted successfully',
  IMAGE_ERROR: 'There was an error saving the image',
  IMAGE_UPLOADED: 'Avatar uploaded successfully',
  UPDATED_SUCCESSFULLY: "updated successfully",
  OLD_EMAIL_MESSAGE: "Your OTP to verify your old email address is:",
  NEW_EMAIL_MESSAGE: "Your OTP to verify your new email address is:",
  TOO_MANY_REQUEST: "Too many request! Try again after 10 minutes!",
  PASSWORD_UPDATED: 'Your password has been updated',
  BLOG_CREATED: "Blog Created successfully",
  DELETED_SUCCESSFULLY: "Deleted successfully!",
  BLOG_NOT_FOUND: 'Blog not found!',
  INVALID_ID: "Invalid ID",
  REQUEST_SENT: "Request Sent successfully",
  PENDING_RESPONSE: "A diet plan request has already been sent and is awaiting a response.",
  IS_PENDING: "You can not edit a pending blog",
  VERIFIED_SUCCESSFULLY: "Verified successfully",
  REJECTED_SUCCESSFULLY: "Rejected successfully",
  DATA_NOT_FOUND: "Data not found",
  PASSWORD_UPDATE_ERROR: "Password update error",
  FORM_SUBMITTED_SUCCESSFULL: "Form submitted successfully",
  ALREADY_VERIFIED: 'Blog is already verified!',
  ALREADY_REJECTED: 'Blog is already rejected!',
  ALREADY_RESPONDED: 'Already responded!',
};


const VALIDATIONS = {
  TOKEN_EXPIRY_TIME: "15d",
  PHONE_REGEX_VALIDATION: /^[0-9]{10}$/,
  EMAIL_REGEX_VALIDATION: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
};



module.exports = {
  STATUS_CODES,
  STATUS_MESSAGES,
  VALIDATIONS
};
