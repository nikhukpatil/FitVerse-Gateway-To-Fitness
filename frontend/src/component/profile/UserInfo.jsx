import React, { useState } from 'react';
import { FaUserEdit, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { uploadAvatar } from '../../Redux/features/auth/authSlice';
import ERRORS from '../../constants/ErrorConstants';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { IoMdMail, IoMdPhonePortrait } from "react-icons/io";
import { Helmet } from 'react-helmet'

const UserInfo = () => {
    const { user } = useSelector((state) => state.auth);
    const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short', year: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options).replace(',', `'`);
    };

    const handleUploadAvatar = async (event) => {
        const imageFile = event.target.files[0];

        if (imageFile) {
            if (!imageFile.type.startsWith('image/')) {
                return toast.error(ERRORS.INVALID_IMAGE);
            }

            try {
                setUploading(true);
                const compressedImage = await compressImage(imageFile);
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const image = reader.result;
                    try {
                        dispatch(uploadAvatar({ image })).then((response) => {
                            if (response.payload.success === true) {
                                setUploading(false);
                                return toast.success(response.payload.message);
                            } else {
                                return toast.error(response.payload);
                            }
                        });
                    } catch (error) {
                        // Handle error
                    }
                };
                reader.readAsDataURL(compressedImage);
            } catch (error) {
                // Handle error
            }
        }
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        return await imageCompression(file, options);
    };

    return (
        <div className='px-5'>
            <Helmet>
                <title>
                    User Profile - Fitverse
                </title>
            </Helmet>
            <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border border-dashed bg-clip-border rounded-2xl border-black bg-light/30 draggable">
                <div className="px-9 pt-9 flex-auto min-h-[70px] pb-0 bg-transparent">
                    <div className="flex flex-wrap mb-6 xl:flex-nowrap">
                        <div className="mb-5 mr-5">
                            <div className="relative inline-block shrink-0 rounded-2xl">
                                {user?.userAvatar?.url ? (
                                    <img className="inline-block shrink-0 rounded-2xl w-[80px] h-[80px] lg:w-[160px] lg:h-[160px]" src={user.userAvatar.url} alt="User Avatar" />
                                ) : (
                                    <FaUserCircle className="inline-block shrink-0 rounded-2xl w-[80px] h-[80px] lg:w-[160px] lg:h-[160px] text-gray-500" />
                                )}
                                <div className="group/tooltip relative">
                                    <section className="absolute bottom-0 right-0">
                                        <div className="group flex justify-center transition-all rounded-full bg-gray-200 p-1">
                                            <label htmlFor="profileUpload" className={`cursor-pointer ${uploading && 'cursor-not-allowed'}`}>
                                                <input
                                                    id="profileUpload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleUploadAvatar}
                                                    disabled={uploading}
                                                />
                                                <FaUserEdit className='w-4 h-4 text-red-500' />
                                            </label>
                                            <span className="absolute -bottom-12 -left-7 opacity-0 group-hover:opacity-100 group-hover:translate-x-7 duration-700 text-sm">Upload Profile</span>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                        <div className="grow">
                            <div className="flex flex-wrap items-start justify-between mb-2">
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-2">
                                        <p className="text-secondary-inverse hover:text-primary transition-colors duration-200 ease-in-out font-semibold text-[1.5rem] mr-1">{user?.fullName}</p>
                                    </div>
                                    <div className="flex flex-wrap pr-2 mb-4 font-medium">
                                        <p className="flex items-center mb-2 mr-5 text-secondary-dark hover:text-primary">
                                            <span className="mr-1">
                                                <IoMdMail />
                                            </span>{user?.email}
                                        </p>
                                        {user?.phone ? (
                                            <p className="flex items-center mb-2 mr-5 text-secondary-dark hover:text-primary">
                                                <span className="mr-1">
                                                    <IoMdPhonePortrait />
                                                </span>{user.phone}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <p>Blogs Created: {user.blogsCreated}</p>
                                        <p>Diet Plan Requested: {user.dietPlansRequested}</p>
                                        <p>Account Created At: {formatDate(user?.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;