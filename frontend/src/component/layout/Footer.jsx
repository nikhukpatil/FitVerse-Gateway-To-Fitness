import React from 'react';
import constant from '../../constants/ImageConstants';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { auth } = useSelector((state) => state.auth);
  const FITVERSE_LOGO = constant.LOGO.FITVERSE_LOGO;
  
  const Top = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          <div className="sm:col-span-2 items-center">
            <img src={FITVERSE_LOGO} alt="fitverse logo" className="w-20 h-20" />
          </div>

          <div>
            <p className="font-semibold">Quick Link</p>
            <div className="flex flex-col items-start mt-5 space-y-2">
              <Link to="/" className="transition-colors duration-300 scroll-smooth" onClick={Top}>Home</Link>
              <Link to="/blogs" className="transition-colors duration-300" onClick={Top}>Blogs</Link>
              <Link to="/bmi" className="transition-colors duration-300" onClick={Top}>BMI</Link>
            </div>
          </div>

          <div>
            <p className="font-semibold">Important Links</p>
            <div className="flex flex-col items-start mt-5 space-y-2">
              <Link to="/faq" className="transition-colors duration-300" onClick={Top}>FAQ</Link>
              <Link to="/about" className="transition-colors duration-300" onClick={Top}>About Us</Link>
              {auth && (
                <Link to="/contact" className="transition-colors duration-300" onClick={Top}>Contact Us</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
