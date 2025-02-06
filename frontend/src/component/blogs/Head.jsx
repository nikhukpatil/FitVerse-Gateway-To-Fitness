import React from 'react';
import constants from '../../constants/ImageConstants';
import { Link } from 'react-router-dom';

const Head = () => {
  const BLOG = constants.BLOGS.BLOG
  return (
    <div className="relative pt-10 sm:pb-20 sm:px-10 px-5">
      <div className="">
        <div className="flex md:flex-row flex-col gap-10 justify-between">
          <div className="w-full lg:w-5/12 px-4">
            <div className="hero-content">
              <h1
                className="
                  text-dark
                  font-bold
                  text-4xl
                  sm:text-[42px]
                  lg:text-[40px]
                  xl:text-[42px]
                  leading-snug
                  mb-3
                "
              >
                Discover <br />
                Inspiring Stories <br />
                on FitVerse Blogs.
              </h1>
              <p className="text-base mb-8 text-body-color max-w-[480px]">
                Welcome to FitVerse, where you can explore a world of insightful articles, personal stories, and expert advice across various topics. Discover inspiring stories and expert advice on health and fitness. Our platform features blogs from both users and experts, sharing their journeys, experiences, and tips to help you on your fitness path.
              </p>
              <ul className="flex flex-wrap items-center">
                <li>
                  <Link
                    to="/profile/blogs"
                    className="
                      py-4
                      px-6
                      sm:px-10
                      lg:px-8
                      xl:px-10
                      inline-flex
                      items-center
                      justify-center
                      text-center text-white text-base
                      bg-red-400
                      hover:bg-opacity-90
                      font-normal
                      rounded-lg
                    "
                  >
                    Write A Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/12"></div>
          <div className="w-full lg:w-6/12">
            <div className="lg:text-right lg:ml-auto">
              <div className="relative inline-block z-1 pt-11 lg:pt-0 md:h-[500px]">
                <div className="lg:w-[500px] md:w-[400px] flex justify-end items-end">
                  <div
                    className="image-container"
                    style={{
                      width: '100%', // Adjust width as needed
                      height: '100%', // Adjust height as needed
                      overflow: 'hidden',
                      position: 'relative',
                      borderRadius: '20px', // Example border radius
                    }}
                  >
                    <div
                      className="w-full sm:rounded-tl-[120px] rounded-tl-[100px] items-end">

                      <img
                        src={BLOG}
                        alt="hero"
                        loading="lazy"
                      />
                    </div>

                  </div>
                </div>
                <span className="absolute -left-8 -bottom-8 z-[-1]">
                  <svg
                    width="93"
                    height="93"
                    viewBox="0 0 93 93"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#FF0000" />
                    <circle cx="2.5" cy="24.5" r="2.5" fill="#FF0000" />
                    <circle cx="2.5" cy="46.5" r="2.5" fill="#FF0000" />
                    <circle cx="2.5" cy="68.5" r="2.5" fill="#FF0000" />
                    <circle cx="2.5" cy="90.5" r="2.5" fill="#FF0000" />
                    <circle cx="24.5" cy="2.5" r="2.5" fill="#FF0000" />
                    <circle cx="24.5" cy="24.5" r="2.5" fill="#FF0000" />
                    <circle cx="24.5" cy="46.5" r="2.5" fill="#FF0000" />
                    <circle cx="24.5" cy="68.5" r="2.5" fill="#FF0000" />
                    <circle cx="24.5" cy="90.5" r="2.5" fill="#FF0000" />
                    <circle cx="46.5" cy="2.5" r="2.5" fill="#FF0000" />
                    <circle cx="46.5" cy="24.5" r="2.5" fill="#FF0000" />
                    <circle cx="46.5" cy="46.5" r="2.5" fill="#FF0000" />
                    <circle cx="46.5" cy="68.5" r="2.5" fill="#FF0000" />
                    <circle cx="46.5" cy="90.5" r="2.5" fill="#FF0000" />
                    <circle cx="68.5" cy="2.5" r="2.5" fill="#FF0000" />
                    <circle cx="68.5" cy="24.5" r="2.5" fill="#FF0000" />
                    <circle cx="68.5" cy="46.5" r="2.5" fill="#FF0000" />
                    <circle cx="68.5" cy="68.5" r="2.5" fill="#FF0000" />
                    <circle cx="68.5" cy="90.5" r="2.5" fill="#FF0000" />
                    <circle cx="90.5" cy="2.5" r="2.5" fill="#FF0000" />
                    <circle cx="90.5" cy="24.5" r="2.5" fill="#FF0000" />
                    <circle cx="90.5" cy="46.5" r="2.5" fill="#FF0000" />
                    <circle cx="90.5" cy="68.5" r="2.5" fill="#FF0000" />
                    <circle cx="90.5" cy="90.5" r="2.5" fill="#FF0000" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Head;