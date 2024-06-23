import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/config'
import toast from 'react-hot-toast';
import ERRORS from '../constants/ErrorConstants';
import VALIDATIONS from '../constants/ValidationsConstants';
import Loader from '../common/Loader'
import { Helmet } from 'react-helmet'

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [resendButton, setResendButton] = useState('Verify')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate()
  const [resetHash, setResetHash] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearFields = () => {
    setFullName('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
    setResetHash('')
    setEmail('');
  };

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSymbols = /[-+_!@#$%^&*.,?]/.test(password);
  const hasMinimumLength = password.length >= 8;

  const passwordStrength = {
    weak: hasMinimumLength,
    moderate: hasMinimumLength && (hasLowerCase || hasUpperCase || hasDigits || hasSymbols),
    strong: hasMinimumLength && hasLowerCase && hasUpperCase && hasDigits && hasSymbols,
  };


  // Send the otp to the Email
  const handleSendOTP = async () => {
    setLoading(true)
    if (!VALIDATIONS.EMAIL_REGEX.test(email)) {
      setLoading(false);
      return toast.error(ERRORS.INVALID_EMAIL)
    }


    try {
      const response = await axios.post(`${API_URL}/api/auth/sendotp`, { email });

      setResetHash(response.data.resetHash)
      toast.success(response.data.message);
      setResendButton('Resend')
      setOtpSent(true);
      setLoading(false)

    } catch (error) {
      setResendButton('Verify')
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      setLoading(false)
    }
  };

  // Verify the email address
  const handleVerifyOTP = async () => {
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/auth/verifyemail`, { email, otp, resetHash });
      toast.success(response.data.message);
      setResendButton('Verify')
      setOtpSent(false);
      setLoading(false)

    } catch (error) {

      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      setLoading(false)

    }


  };

  // Signup the user
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true)

    // Check all the  required fields
    if (!fullName || !email || !password || !confirmPassword) {
      setLoading(false)
      return toast.error(ERRORS.REQUIRED_DETAILS);
    }

    // Email Validations
    if (!VALIDATIONS.EMAIL_REGEX.test(email)) {
      setLoading(false)
      return toast.error(ERRORS.INVALID_EMAIL)
    }
    // If phone than check the phone validations
    if (phone && !VALIDATIONS.PHONE_REGEX.test(phone)) {
      setLoading(false)
      return toast.error(ERRORS.INVALID_PHONE)
    }

    // Check if the password is strong
    if (!passwordStrength.strong) {
      setLoading(false)
      return toast.error(ERRORS.WEAK_PASSWORD)
    }

    // check if the passwords match
    if (password !== confirmPassword) {
      setLoading(false)
      return toast.error(ERRORS.DIFFERENT_PASSWORDS);
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, { fullName, email, phone, password, confirmPassword });
      setLoading(false)
      toast.success(response.data.message);
      clearFields();
      navigate('/signin')
      window.scrollTo(0, 0);

    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      setLoading(false)

    }

  };



  return (
    <>
      <Helmet>
        <title>
          SignUp - Fitverse
        </title>
      </Helmet>
      <form className=' w-full flex justify-center pt-16 sm:pb-32 pb-20 ' onSubmit={handleSignup}>
        {loading &&
          <div className="fixed inset-0 overflow-hidden w-full h-full flex justify-center items-center z-50  bg-[#00000040]">
            <div className='w-20 h-20' >
              <Loader />
            </div>
          </div>
        }
        <div
          className="relative flex sm:w-[450px] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md"
        >
          <div
            className="relative mx-4 -mt-6 mb-4 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-red-600 to-red-400 bg-clip-border text-white shadow-lg shadow-red-500/40"
          >
            <h3
              className="block font-sans text-3xl font-semibold leading-snug tracking-normal text-white antialiased"
            >
              Sign Up
            </h3>
          </div>

          {/* Full Name */}

          <div className="flex flex-col gap-4 p-6">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder=""
                onChange={(e) => setFullName(e.target.value)}
                required
                type='text'
                maxLength='100'
                className="peer h-full w-full rounded-md border border-red-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-red-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-gray-200 placeholder-shown:border-t-red-gray-200 focus:border-2 focus:border-red-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-red-gray-50"
              />
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-red-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-red-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-red-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-red-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-red-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-red-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-red-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-red-gray-500"
              >
                Full Name  <span className="text-red-500 mx-1">*</span>
              </label>
            </div>


            {/* Email */}
            <div className="relative flex items-center h-11 w-full min-w-[200px]">
              <input
                placeholder=""
                onChange={(e) => {
                  const lowercasedValue = e.target.value.toLowerCase();
                  setEmail(lowercasedValue);
                }}
                required
                type='email'
                maxLength='320'
                className="peer flex-grow h-full rounded-md border border-red-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-red-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-gray-200 placeholder-shown:border-t-red-gray-200 focus:border-2 focus:border-red-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-red-gray-50"
              />
              <button
                onClick={handleSendOTP}
                type='button'
                className="ml-2 sm:px-4 px-1 py-2 rounded-md bg-red-500 text-white font-semibold shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {resendButton}
              </button>
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-red-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-red-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-red-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-red-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-red-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-red-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-red-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-red-gray-500"
              >
                Email <span className="text-red-500 mx-1">*</span>
              </label>
            </div>

            {/* OTP */}

            {otpSent && (
              <div className="relative flex items-center h-11 w-full min-w-[200px]">
                <input
                  placeholder=""
                  onChange={(e) => setOtp(e.target.value)}
                  type='text'
                  maxLength='10'
                  pattern='\d{1,10}'
                  className="peer flex-grow h-full rounded-md border border-red-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-red-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-gray-200 placeholder-shown:border-t-red-gray-200 focus:border-2 focus:border-red-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-red-gray-50"
                />
                <button
                  onClick={handleVerifyOTP}
                  type='button'
                  className="ml-2 sm:px-4 px-1 py-2 rounded-md bg-red-500 text-white font-semibold shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Verify
                </button>
                <label
                  className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-red-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-red-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-red-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-red-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-red-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-red-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-red-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-red-gray-500"
                >
                  OTP <span className="text-red-500 mx-1">*</span>
                </label>
              </div>
            )}

            {/* Phone */}

            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder=""
                onChange={(e) => setPhone(e.target.value)}
                type='text'
                maxLength='10'
                pattern='\d{1,10}'
                className="peer h-full w-full rounded-md border border-red-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-red-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-gray-200 placeholder-shown:border-t-red-gray-200 focus:border-2 focus:border-red-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-red-gray-50"
              />
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-red-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-red-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-red-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-red-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-red-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-red-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-red-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-red-gray-500"
              >
                Phone
              </label>
            </div>

            {/* Password */}
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
                required
                type='password'
                maxLength='128'
                className="peer h-full w-full rounded-md border border-red-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-red-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-gray-200 placeholder-shown:border-t-red-gray-200 focus:border-2 focus:border-red-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-red-gray-50"
              />
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-red-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-red-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-red-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-red-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-red-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-red-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-red-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-red-gray-500"
              >
                Password  <span className="text-red-500 mx-1">*</span>
              </label>
            </div>

            {/* Confirm Password */}
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                placeholder=""
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                type='password'
                maxLength='128'
                className="peer h-full w-full rounded-md border border-red-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-red-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-red-gray-200 placeholder-shown:border-t-red-gray-200 focus:border-2 focus:border-red-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-red-gray-50"
              />
              <label
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-red-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-red-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-red-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-red-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-red-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-red-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-red-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-red-gray-500"
              >
                Confirm Password  <span className="text-red-500 mx-1">*</span>
              </label>
            </div>
          </div>
          <div className="p-6 pt-0">
            <button
              data-ripple-light="true"
              type="submit"
              className="block w-full select-none rounded-lg bg-gradient-to-tr from-red-600 to-red-400 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Sign Up
            </button>
            <p
              className="mt-6 flex justify-center font-sans text-sm font-light leading-normal text-inherit antialiased"
            >
              Already have an account?

              <Link to='/signin' className="ml-1 block font-sans text-sm font-bold leading-normal text-red-500 antialiased">
                Sign In
              </Link>

            </p>
          </div>
        </div>

      </form>
    </>
  );
};

export default Signup
