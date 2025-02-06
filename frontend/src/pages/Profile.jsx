import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import BMI from '../component/profile/BMI';
import UserInfo from '../component/profile/UserInfo';
import YourBlogs from '../component/profile/YourBlogs';
import DietPlans from '../component/profile/DietPlans';
import AccountSetting from '../component/profile/AccountSetting';
import { signOut } from '../Redux/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ImProfile } from "react-icons/im";
import { LiaBlogSolid } from "react-icons/lia";
import { MdNoFood } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { IoIosBody } from "react-icons/io";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    switch (location.pathname) {
      case '/profile':
        setActiveSection('profile');
        break;
      case '/profile/bmi':
        setActiveSection('bmi');
        break;
      case '/profile/blogs':
        setActiveSection('blogs');
        break;
      case '/profile/diet-plans':
        setActiveSection('diet-plans');
        break;
      case '/profile/setting':
        setActiveSection('setting');
        break;
      default:
        setActiveSection('');
        break;
    }
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="sm:px-10 px-5 flex sm:flex-row flex-col sm:gap-0 gap-10 py-10">
      <aside className={`sm:w-72 w-full h-fit border-2 p-5 ${window.innerWidth < 640 ? 'hidden' : 'block'}`}>
        <div className="flex items-center mb-10 flex-col">\
          {user?.userAvatar?.url ? (
            <img className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold" src={user.userAvatar.url} alt="User Avatar" />
          ) : (
            <FaUserCircle className="w-14 h-14 rounded-full flex items-center justify-center text-gray-500 font-bold" />
          )}
        </div>
        <nav>
          <ul className='flex flex-col text-lg gap-y-3'>
            <li className={`pb-4 mb-2 border-b-2 ${activeSection === 'profile' ? 'border-b-2 border-red-500' : ''}`}>
              <NavLink
                to="/profile"
                className={`flex gap-2 items-center ${activeSection === 'profile' ? 'text-red-500 font-bold bg-gray-200 p-2' : ''}`}
              >
                <ImProfile />
                Profile
              </NavLink>
            </li>
            <li className={`pb-4 mb-2 border-b-2 ${activeSection === 'bmi' ? 'border-b-2 border-red-500' : ''}`}>
              <NavLink
                to="/profile/bmi"
                className={`flex gap-2 items-center ${activeSection === 'bmi' ? 'text-red-500 font-bold bg-gray-200 p-2' : ''}`}
              >
                <IoIosBody />
                BMI
              </NavLink>
            </li>
            <li className={`pb-4 mb-2 border-b-2 ${activeSection === 'blogs' ? 'border-b-2 border-red-500' : ''}`}>
              <NavLink
                to="/profile/blogs"
                className={`flex gap-2 items-center ${activeSection === 'blogs' ? 'text-red-500 font-bold bg-gray-200 p-2' : ''}`}
              >
                <LiaBlogSolid />
                Blogs
              </NavLink>
            </li>
            <li className={`pb-4 mb-2 border-b-2 ${activeSection === 'diet-plans' ? 'border-b-2 border-red-500' : ''}`}>
              <NavLink
                to="/profile/diet-plans"
                className={`flex gap-2 items-center ${activeSection === 'diet-plans' ? 'text-red-500 font-bold bg-gray-200 p-2' : ''}`}
              >
                <MdNoFood />
                Diet Plans
              </NavLink>
            </li>
            <li className={`pb-4 mb-2 border-b-2 ${activeSection === 'setting' ? 'border-b-2 border-red-500' : ''}`}>
              <NavLink
                to="/profile/setting"
                className={`flex gap-2 items-center ${activeSection === 'setting' ? 'text-red-500 font-bold bg-gray-200 p-2' : ''}`}
              >
                <IoSettings />
                Setting
              </NavLink>
            </li>
            <li>
              <button className='flex gap-2 items-center' onClick={handleSignOut}>
                <FaSignOutAlt />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="w-full mx-auto sm:hidden">
        <div className=" bg-white shadow-lg rounded-2xl">
          <div className="flex">
            <div className="flex-1 group">
              <NavLink to="/profile" className="flex gap-2 items-center flex-col justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-red-500">
                <span className={`px-1 pt-1 pb-1 flex flex-col items-center ${activeSection === 'profile' ? 'text-red-500' : ''}`}>
                  <ImProfile className='mb-2' />
                  <span className='text-xs'>Profile</span>
                  <span className="block w-5 mx-auto h-1 group-hover:bg-red-500 rounded-full"></span>
                </span>
              </NavLink>
            </div>
            <div className="flex-1 group">
              <NavLink to="/profile/bmi" className="flex gap-2 items-center flex-col justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-red-500">
                <span className={`px-1 pt-1 pb-1 flex flex-col items-center ${activeSection === 'BMI' ? 'text-red-500' : ''}`}>
                  <IoIosBody className='mb-2' />
                  <span className='text-xs'>BMI</span>
                  <span className="block w-5 mx-auto h-1 group-hover:bg-red-500 rounded-full"></span>
                </span>
              </NavLink>
            </div>
            <div className="flex-1 group">
              <NavLink to="/profile/blogs" className="flex gap-2 items-center flex-col justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-red-500">
                <span className={`px-1 pt-1 pb-1 flex flex-col items-center ${activeSection === 'blogs' ? 'text-red-500' : ''}`}>
                  <LiaBlogSolid className='mb-2' />
                  <span className='text-xs'>Blogs</span>
                  <span className="block w-5 mx-auto h-1 group-hover:bg-red-500 rounded-full"></span>
                </span>
              </NavLink>
            </div>
            <div className="flex-1 group">
              <NavLink to="/profile/diet-plans" className="flex gap-2 items-center flex-col justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-red-500">
                <span className={`px-1 pt-1 pb-1 flex flex-col items-center ${activeSection === 'diet-plans' ? 'text-red-500' : ''}`}>
                  <MdNoFood className='mb-2' />
                  <span className='text-xs'>Diet Plans</span>
                  <span className="block w-5 mx-auto h-1 group-hover:bg-red-500 rounded-full"></span>
                </span>
              </NavLink>
            </div>
            <div className="flex-1 group">
              <NavLink to="/profile/setting" className="flex gap-2 items-center flex-col justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-red-500">
                <span className={`px-1 pt-1 pb-1 flex flex-col items-center ${activeSection === 'setting' ? 'text-red-500' : ''}`}>
                  <IoSettings className='mb-2' />
                  <span className='text-xs'>Setting</span>
                  <span className="block w-5 mx-auto h-1 group-hover:bg-red-500 rounded-full"></span>
                </span>
              </NavLink>
            </div>
            <div className="flex-1 group">
              <NavLink className="flex gap-2 items-center flex-col justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-red-500" onClick={handleSignOut}>
                <span className={`px-1 pt-1 pb-1 flex flex-col items-center ${activeSection === 'sign-out' ? 'text-red-500' : ''}`}>
                  <FaSignOutAlt className='mb-2' />
                  <span className='text-xs'>Sign Out</span>
                  <span className="block w-5 mx-auto h-1 group-hover:bg-red-500 rounded-full"></span>
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>


      <main className="sm:w-3/4 sm:px-10 mb-20 w-full">
        <Routes>
          <Route path="/" element={<UserInfo />} />
          <Route path="bmi" element={<BMI />} />
          <Route path="blogs" element={<YourBlogs />} />
          <Route path="diet-plans" element={<DietPlans />} />
          <Route path="setting" element={<AccountSetting />} />
        </Routes>
      </main>
    </div>
  );
};

export default Profile;
