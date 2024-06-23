import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import { Sling as Hamburger } from 'hamburger-react';
import constant from '../../constants/ImageConstants';
import { useSelector } from 'react-redux';

function Navbar() {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const location = useLocation();
  const FITVERSE_LOGO = constant.LOGO.FITVERSE_LOGO;
  const users = useSelector((state) => state.auth);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 640);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isNavVisible && window.innerWidth <= 640) {
        setIsNavVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isNavVisible]);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const closeNav = () => {
    setIsNavVisible(false);
    window.scrollTo(0, 0);
  };

  const smoothScrollToTop = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: 'easeInOutQuart',
    });
  };

  const isSamePage = (path) => {
    return location.pathname === path;
  };

  const handleSignInClick = () => {
    localStorage.clear();
    closeNav();
  };

  return (
    <div className={`text-white ${isSmallScreen ? 'sticky top-0 z-10 w-full bg-black bg-opacity-80' : 'w-full top-0 sticky bg-black bg-opacity-80 z-10 flex justify-between items-center px-10'}`}>
      <div className='flex justify-between items-center sm:w-auto'>
        <Link to="/" onClick={isSamePage('/') ? smoothScrollToTop : closeNav} className='p-3'>
          <div className='sm:w-[35px] h-7 sm:h-[35px] sm:pl-0 pl-5'>
            <img className='w-full h-full' src={FITVERSE_LOGO} alt='logo' />
          </div>
        </Link>
        {isSmallScreen && (
          <div className="px-3">
            <Hamburger
              toggled={isNavVisible}
              toggle={toggleNav}
              duration={0.8}
              size={22}
              color="#FF0000"
              aria-label="Open Menu"
            />
          </div>
        )}
      </div>

      <ul
        className={`${
          isSmallScreen
            ? (isNavVisible ? 'flex flex-col gap-y-10 absolute bg-black w-full bg-opacity-80 px-6 py-5 -mt-[1px]' : 'hidden')
            : 'flex md:text-base uppercase lg:gap-24 md:gap-14 sm:gap-8'
        }`}
      >
        {[
          { path: '/', label: 'Home' },
          { path: '/blogs', label: 'Blogs' },
          { path: '/bmi', label: 'BMI' },
          { path: '/diet', label: 'Diet' },
          { path: users?.user !== null ? '/profile' : '/signin', label: users?.user !== null ? 'Profile' : 'Sign-in', onClick: users?.user !== null ? closeNav : handleSignInClick },
        ].map((item) => (
          <Link
            key={item.path}
            className={`${isSamePage(item.path) ? 'text-red-500 font-bold' : 'hover:text-Whitefooter '} ${isSmallScreen ? 'mb-4' : ''}`}
            to={item.path}
            onClick={() => {
              if (isSamePage(item.path)) {
                smoothScrollToTop();
              }
              if (item.onClick) {
                item.onClick();
              } else {
                closeNav();
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;
