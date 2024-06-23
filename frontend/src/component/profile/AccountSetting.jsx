import React, { useState, useEffect } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL, config } from '../../config/config';
import { updateUser, getUser, changePassword } from '../../Redux/features/auth/authSlice';
import { Helmet } from 'react-helmet'

const AccountSetting = () => {
    const { user } = useSelector((state) => state.auth);
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [oldEmailOTP, setOldEmailOTP] = useState('');
    const [newEmailOTP, setNewEmailOTP] = useState('');
    const [resetHash, setResetHash] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editPassword, setEditPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleEditName = () => setEditName(true);

    const handleSaveName = () => {
        if (!fullName) return toast.error('Field cannot be empty');
        dispatch(updateUser({ fullName })).then(response => {
            if (response.payload.success) {
                toast.success(response.payload.message);
                setEditName(false);
            } else {
                toast.error(response.payload);
            }
        });
    };

    const handleEditEmail = () => setEditEmail(true);

    const handleSavePhone = () => {
        dispatch(updateUser({ phone })).then(response => {
            if (response.payload.success) {
                toast.success(response.payload.message);
                setEditPhone(false);
            } else {
                toast.error(response.payload);
            }
        });
    };

    const handleCancelName = () => setEditName(false);

    const handleCancelEmail = () => setEditEmail(false);

    const handleVerifyOTP = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/user/save-changed-email`, {
                email: email, otp: oldEmailOTP, newEmailOTP: newEmailOTP, resetHash
            }, config);
            toast.success(response.data.message);
            setOldEmailOTP('');
            setNewEmailOTP('');
            setResetHash('');
            setEmail('');
            setModalOpen(false);
            setEditEmail(false);
            dispatch(getUser());
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleOpenModal = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/user/change-email-otp`, { email: email }, config);
            toast.success(response.data.message);
            setResetHash(response.data.resetHash);
            setModalOpen(true);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleCloseModal = () => {
        setOldEmailOTP('');
        setNewEmailOTP('');
        setModalOpen(false);
    };

    const handleCancelPhone = () => setEditPhone(false);

    const handleEditPassword = () => setEditPassword(true);

    const handleEditPhone = () => setEditPhone(true);

    const handleSavePassword = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            return toast.error('Field cannot be empty');
        }
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        dispatch(changePassword({ oldPassword, newPassword, confirmPassword })).then((response) => {
            if (response.payload.success) {
                toast.success(response.payload.message);
                setEditPassword(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
            else {
                toast.error(response.payload.message);
            }
        })
    };

    const handleCancelPassword = () => setEditPassword(false);

    return (
        <div className="rounded-lg px-5 ">
            <Helmet>
                <title>
                    Account Setting - Fitverse
                </title>
            </Helmet>
            <div className=" shadow overflow-hidden sm:rounded-lg">

                <div className="">
                    <dl>
                        <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                                {editName ? (
                                    <>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            autoFocus
                                        />
                                        <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={handleSaveName}>Save</button>
                                        <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={handleCancelName}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{user?.fullName}</span>
                                        <MdOutlineEdit className="text-red-500 cursor-pointer" onClick={handleEditName} />
                                    </>
                                )}
                            </dd>
                        </div>
                        <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                                {editEmail ? (
                                    <>
                                        <input
                                            type="email"
                                            autoFocus
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                        <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={handleOpenModal}>Send OTP</button>
                                        <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={handleCancelEmail}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{user?.email}</span>
                                        <MdOutlineEdit className="text-red-500 cursor-pointer" onClick={handleEditEmail} />
                                    </>
                                )}
                            </dd>
                        </div>
                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                                {editPhone ? (
                                    <>
                                        <input
                                            type="number"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={phone}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                if (/^\d{0,10}$/.test(inputValue)) {
                                                    setPhone(inputValue);
                                                }
                                            }}
                                            autoFocus
                                        />
                                        <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={handleSavePhone}>Save</button>
                                        <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={handleCancelPhone}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{user?.phone ? user.phone : 'Not provided'}</span>
                                        {user?.phone ? (
                                            <MdOutlineEdit className="text-red-500 cursor-pointer" onClick={handleEditPhone} />
                                        ) : (
                                            <IoMdAddCircleOutline className="text-red-500 cursor-pointer" onClick={handleEditPhone} />
                                        )}
                                    </>
                                )}
                            </dd>
                        </div>
                        <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <div className="text-sm font-medium text-gray-500">Password</div>
                            <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center gap-2">
                                {editPassword ? (
                                    <>
                                        <div className='flex flex-col sm:w-1/2 w-full gap-2'>
                                            <input
                                                type="password"
                                                placeholder="Old Password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={handleSavePassword}>Save</button>
                                            <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={handleCancelPassword}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span>********</span>
                                        <MdOutlineEdit className="text-red-500 cursor-pointer" onClick={handleEditPassword} />
                                    </>
                                )}
                            </div>
                        </div>
                    </dl>
                </div>
            </div>
            {modalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className=" rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full bg-white">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Verify OTP</h3>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="Old Email OTP"
                                                value={oldEmailOTP}
                                                onChange={(e) => setOldEmailOTP(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New Email OTP"
                                                value={newEmailOTP}
                                                onChange={(e) => setNewEmailOTP(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={handleVerifyOTP} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm">Verify</button>
                                <button onClick={handleCloseModal} className=" w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2  text-base font-medium text-gray-700 hover:sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSetting;
