import axios from 'axios';
import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import { API_URL, config } from '../config/config';
import Loader from '../common/Loader';
import ERROR from '../constants/ErrorConstants';
import { Helmet } from 'react-helmet'

const ResetPassword = () => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSymbols = /[-+_!@#$%^&*.,?]/.test(password);
    const hasMinimumLength = password.length >= 8;
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    const passwordStrength = {
        weak: hasMinimumLength,
        moderate: hasMinimumLength && (hasLowerCase || hasUpperCase || hasDigits || hasSymbols),
        strong: hasMinimumLength && hasLowerCase && hasUpperCase && hasDigits && hasSymbols,
    };

    const strengthColors = {
        weak: 'bg-red-300',
        moderate: 'bg-yellow-300',
        strong: 'bg-green-300',
    };


    const resetPassword = async () => {
        // Check if all fields are empty
        if (!password && !confirmPassword) {
            toast.error(ERROR.EMPTY_FILED);
            return;
        }
        // Validate the password and confirmPassword
        if (!password) {
            setError('Please enter the password.');
        } else if (!confirmPassword) {
            setError('Please confirm the password.');
        } else if (password.length < 8) {
            setError('Password must be at least 8 characters.');
        } else if (!hasLowerCase || !hasUpperCase || !hasDigits || !hasSymbols) {
            setError('Password must include at least one lowercase letter, one uppercase letter, one digit, and one special symbol.');
        } else if (password !== confirmPassword) {
            setError('Passwords do not match.');
        } else {
            const resetPasswordToken = localStorage.getItem('resetPasswordToken') || null;
            try {
                const response = await axios.post(`${API_URL}/api/auth/reset-password`, { password, confirmPassword, resetPasswordToken }, config);
                if (response.status === 200) {
                    toast.success(response.data.message);
                    localStorage.removeItem('resetPasswordToken');
                }
            } catch (error) {
                return toast.error(error.response.data.message);
            }
            navigate('/signin');
        }
    };

    const togglePasswordVisibility = () => {
        setVisible(!visible);
    };



    return (
        <>
            <Helmet>
                <title>
                    Reset Password - Fitverse
                </title>
            </Helmet>
            <div className='h-full w-auto bg-[#f7fafc]'>
                <div className="inset-0 flex items-center justify-center z-50 p-10 sm:p-20">
                    <div className="bg-white rounded-lg p-4 sm:p-8 shadow-lg max-w-4xl w-full">
                        <div className="flex flex-col mr-5 md:flex-row">
                            <div className="md:w-1/2">
                                <img
                                    src="https://img.freepik.com/free-vector/private-data-concept-illustration_114360-5135.jpg?size=626&ext=jpg&ga=GA1.1.584503204.1684751112&semt=ais"
                                    alt="jfdjf"
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
                                <h2 className="text-3xl font-bold mb-4">Reset Password</h2>
                                {/* Password field */}
                                <div>

                                    <div className="relative">
                                        <input
                                            type={visible ? 'text' : 'password'}
                                            value={password}
                                            className=' p-1 w-4/6 border border-red-400 outline-none focus:border-red-600'
                                            label='New Password'
                                            placeholder='Password'
                                            onChange={(e) => setPassword(e.target.value)}
                                            minLength={8}
                                            maxLength={16}
                                        />

                                        {/* eye open/close */}
                                        <span
                                            className="absolute ml-4  bottom-2 cursor-pointer"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {visible ? (
                                                <AiOutlineEye className="h-6 w-6 text-gray-500 hover:text-[#8A58DC] transition-colors duration-300" />
                                            ) : (
                                                <AiOutlineEyeInvisible className="h-6 w-6 text-gray-500 hover:text-[#8A58DC] transition-colors duration-300" />
                                            )}
                                        </span>
                                    </div>
                                    <label className="block text-sm text-black opacity-50 mt-2">
                                        Must be at least 8 characters.
                                    </label>
                                    {/* Password strength indicator */}
                                    {password && (
                                        <div className="my-5">
                                            <div className="flex">
                                                <div className={`w-1/3 h-1 ${passwordStrength.weak ? strengthColors.weak : ''} transition-colors duration-300`}></div>
                                                <div className={`w-1/3 h-1 ${passwordStrength.moderate ? strengthColors.moderate : ''} transition-colors duration-300`}></div>
                                                <div className={`w-1/3 h-1 ${passwordStrength.strong ? strengthColors.strong : ''} transition-colors duration-300`}></div>
                                            </div>

                                            <div className="grid justify-between mt-1 text-xs">
                                                <div className="text-gray-500">
                                                    <span className={`mr-2 ${hasMinimumLength ? 'text-green-500' : 'text-red-500'}`}>{hasMinimumLength ? '✓' : '✗'}</span> 8-16 characters
                                                </div>
                                                <div className="text-gray-500">
                                                    <span className={`mr-2 ${hasLowerCase ? 'text-green-500' : 'text-red-500'}`}>{hasLowerCase ? '✓' : '✗'}</span> At least 1 lowercase letter
                                                </div>
                                                <div className="text-gray-500">
                                                    <span className={`mr-2 ${hasUpperCase ? 'text-green-500' : 'text-red-500'}`}>{hasUpperCase ? '✓' : '✗'}</span> At least 1 uppercase letter
                                                </div>
                                                <div className="text-gray-500">
                                                    <span className={`mr-2 ${hasDigits ? 'text-green-500' : 'text-red-500'}`}>{hasDigits ? '✓' : '✗'}</span> At least 1 digit
                                                </div>
                                                <div className="text-gray-500">
                                                    <span className={`mr-2 ${hasSymbols ? 'text-green-500' : 'text-red-500'}`}>{hasSymbols ? '✓' : '✗'}</span> Contains special symbol -+_!@#$%^&*.,?
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Confirm password */}
                                <div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        placeholder="********"
                                        className=' p-1 w-4/6 border border-red-400 outline-none focus:border-red-600'
                                        maxLength={16}
                                        minLength={8}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {/* Warning message */}
                                    {confirmPassword && password !== confirmPassword && (
                                        <label className="block text-sm text-red-500 mt-1">
                                            Passwords do not match.
                                        </label>
                                    )}
                                    {confirmPassword && password === confirmPassword && (
                                        <label className="block text-sm text-green-500 mt-1">
                                            Passwords match.
                                        </label>
                                    )}
                                </div>
                                {/* Display the error message if there is one */}
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                                {/* Reset button */}
                                <div className='mt-4'>
                                    <button
                                        className=" sm:px-4 px-1 py-1 rounded-md bg-red-500 text-white font-semibold shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        onClick={resetPassword}
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;