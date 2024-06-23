import React from 'react';
import { FaCalculator } from "react-icons/fa";
import { FaBlogger } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { MdEmojiFoodBeverage } from "react-icons/md";
import { Helmet } from 'react-helmet'

const About = () => {
  return (
    <div>
      <Helmet>
        <title>
          About Us - Fitverse
        </title>
      </Helmet>
      <section className="relative py-16 bg-blueGray-50">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-78">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-red-500">
                <blockquote className="relative p-8 mb-4">
                  <h4 className="text-xl font-bold text-white">
                    FitVerse: Gateway to Fitness
                  </h4>
                  <p className="text-md font-light mt-2 text-white">
                    Track your BMI, get personalized diet plans, and stay updated with the latest fitness trends from top influencers.
                  </p>
                </blockquote>
              </div>
            </div>

            <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                        <FaCalculator className=' text-2xl' />
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">BMI Calculator</h6>
                      <p className="mb-4 text-blueGray-500">
                        Use our accurate BMI calculator to track your progress and stay on top of your fitness goals.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                        <FaSave className=' text-2xl' />
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">
                        Save Your Data
                      </h6>
                      <p className="mb-4 text-blueGray-500">
                        Easily save your BMI results and access them anytime, anywhere.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col min-w-0 mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                        <FaBlogger className=' text-2xl' />
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Influencer Blogs</h6>
                      <p className="mb-4 text-blueGray-500">
                        Stay inspired with tips and stories from top fitness influencers. Read their blogs to stay motivated.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                        <MdEmojiFoodBeverage className=' text-2xl' />
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Diet Plans</h6>
                      <p className="mb-4 text-blueGray-500">
                        Receive personalized diet plans tailored to your needs and fitness goals. Eat right, feel great!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;