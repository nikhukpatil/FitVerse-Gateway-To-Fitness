import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordWithEmail, resetMessage } from '../Redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config/config';
import Loader from '../common/Loader';
import ERROR from '../constants/ErrorConstants';
import { Helmet } from 'react-helmet'
import VALIDATION from '../constants/ValidationsConstants';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(300);
  const [emailOrPhoneError, setEmailOrPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetHash, setResetHash] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const timerIntervalRef = useRef(null);

  const sendOTP = () => {
    if (!email && !VALIDATION.EMAIL_REGEX.test(email)) {
      toast.error(ERROR.INVALID_EMAIL);
      setEmailOrPhoneError(ERROR.INVALID_EMAIL);
      setShowOTP(false);
      return;
    }
    setLoading(true);
    dispatch(forgotPasswordWithEmail({ email })).then((response) => {
      setLoading(false);
      if (response.error) {
        toast.error(response.payload);
        dispatch(resetMessage());
      } else {
        toast.success(response.payload.message);
        setResetHash(response.payload.resetHash);
        setEmailOrPhoneError('');
        setShowOTP(true);
        startResendTimer();
        dispatch(resetMessage());
      }
    }).catch(() => {
      setLoading(false);
    });
  };

  const verifyOTP = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.error(ERROR.EMPTY_FILED);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/resetpasswordOTP`, {
        email: email,
        otp: otpValue,
        resetHash: resetHash,
      });
      setLoading(false);
      localStorage.setItem('resetPasswordToken', response.data.resetPasswordToken);
      navigate('/reset-password');
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleOTPChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setOtpValue(numericValue);
    if (numericValue.length === 6) {
      setOtpError('');
    } else {
      setOtpError('Please enter a 6-digit OTP.');
    }
  };

  const startResendTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setResendTimer(90);
    timerIntervalRef.current = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(timerIntervalRef.current);
          return 0;
        }
      });
    }, 1000);
  };

  const resetTimer = () => {
    startResendTimer();
  };

  useEffect(() => {
    if (showOTP) {
      startResendTimer();
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [showOTP]);

  return (
    <>
     <Helmet>
        <title>
          Forget Password - Fitverse
        </title>
      </Helmet>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25">
          <div className=' w-20 h-20'>
            <Loader />
          </div>
        </div>
      )}
      <div className='h-full w-auto bg-[#f7fafc]'>
        <div className="inset-0 flex items-center justify-center z-50 p-10 sm:p-20">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-4xl w-full">
            <div className="flex flex-col mr-5 md:flex-row">
              <div className="md:w-1/2">
                <img
                  src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7876.jpg?size=626&ext=jpg&ga=GA1.1.584503204.1684751112&semt=ais"
                  alt="Image1"
                  loading='lazy-loading'
                  className="h-auto w-full mx-auto md:ml-0 md:mr-8 mb-4 md:mb-0"
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="w-full mx-auto h-[200px] flex items-center justify-center">
                    <Loader />
                  </div>
                )}
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">Forgot Password</h2>
                <input
                  type="email"
                  className=' p-1 w-4/6 border border-red-400 outline-none focus:border-red-600'
                  id="email"
                  label='Email'
                  name="email"
                  value={email}
                  onChange={(e) => {
                    const lowercasedValue = e.target.value.toLowerCase();
                    setEmail(lowercasedValue);
                    setEmailOrPhoneError('');
                  }}
                  placeholder="example@gmail.com"
                />
                {emailOrPhoneError && <p className="text-red-500 text-sm">{emailOrPhoneError}</p>}
                {!showOTP ? (
                  <div className='mt-4'>
                    <button
                      className=" sm:px-4 px-1 py-1 rounded-md bg-red-500 text-white font-semibold shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={sendOTP}
                    >
                      Send OTP
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col mt-2">
                    <input
                      type="text"
                      className=' p-1 w-4/6 border border-red-400 outline-none focus:border-red-600'
                      label="Enter OTP"
                      value={otpValue}
                      maxLength={6}
                      onChange={handleOTPChange}
                      placeholder="Enter OTP *"
                    />
                    {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
                    <div className="flex flex-col my-2">
                      <div>
                        Didn't receive OTP?{" "}
                        {resendTimer > 0 ? (
                          <span className='text-gray-400'>
                            Resend ({Math.floor(resendTimer / 60)}:
                            {String(resendTimer % 60).padStart(2, "0")} )
                          </span>
                        ) : (
                          <div
                            className="text-[#8A58DC] cursor-pointer"
                            onClick={() => {
                              resetTimer();
                              sendOTP();
                            }}
                          >
                            Resend OTP
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className="text-[#8A58DC] cursor-pointer text-left"
                      onClick={verifyOTP}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
