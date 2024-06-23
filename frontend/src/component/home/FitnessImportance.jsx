import React from 'react';
import constants from '../../constants/ImageConstants';
import { RiMentalHealthFill } from "react-icons/ri";
import { MdHealthAndSafety } from "react-icons/md";
import { GiRelationshipBounds } from "react-icons/gi";

const FitnessImportance = () => {
    const PROPER_DIET = constants.HOME.PROPER_DIET
    return (
        <section className=" bg-black">
            <div className="container px-6 py-10 mx-auto">
                <div className="lg:flex lg:items-center">
                    <div className="w-full space-y-12 lg:w-1/2">
                        <div>
                            <h1 className="text-3xl font-semibold text-red-500 capitalize lg:text-4xl ">
                                The Importance of <br /> Physical Fitness
                            </h1>

                            <div className="mt-2">
                                <span className="inline-block w-40 h-1 rounded-full bg-red-500"></span>
                                <span className="inline-block w-3 h-1 ml-1 rounded-full bg-red-500"></span>
                                <span className="inline-block w-1 h-1 ml-1 rounded-full bg-red-500"></span>
                            </div>
                        </div>

                        <div className="md:flex md:items-start md:-mx-4">
                            <span className="inline-block p-2 text-red-500 bg-red-100 rounded-xl md:mx-4 ">
                                <RiMentalHealthFill className=' text-3xl'/>
                            </span>

                            <div className="mt-4 md:mx-4 md:mt-0">
                                <h1 className="text-2xl font-semibold text-red-500 capitalize ">
                                    Improved Mental Health
                                </h1>

                                <p className="mt-3 text-white ">
                                    Regular physical activity can help reduce symptoms of depression and anxiety, and promote a better mood and overall mental well-being.
                                </p>
                            </div>
                        </div>

                        <div className="md:flex md:items-start md:-mx-4">
                            <span className="inline-block p-2 text-red-500 bg-red-100 rounded-xl md:mx-4 ">
                            <MdHealthAndSafety className=' text-3xl'/>
                            </span>

                            <div className="mt-4 md:mx-4 md:mt-0">
                                <h1 className="text-2xl font-semibold text-red-500  capitalize">
                                    Enhanced Physical Health
                                </h1>

                                <p className="mt-3 text-white ">
                                    Staying active can help you maintain a healthy weight, reduce your risk of chronic diseases, and strengthen your muscles and bones.
                                </p>
                            </div>
                        </div>

                        <div className="md:flex md:items-start md:-mx-4">
                            <span className="inline-block p-2 text-red-500 bg-red-100 rounded-xl md:mx-4 0">
                            <GiRelationshipBounds className=' text-3xl'/>
                            </span>

                            <div className="mt-4 md:mx-4 md:mt-0">
                                <h1 className="text-2xl font-semibold text-red-500  capitalize ">
                                    Social Benefits
                                </h1>

                                <p className="mt-3 text-white ">
                                    Engaging in physical activities often involves social interaction, which can help build community and foster relationships.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex lg:items-center lg:w-1/2 lg:justify-center">
                        <img
                            className="w-full h-auto object-cover xl:w-auto xl:h-auto rounded-full"
                            src={PROPER_DIET}
                            alt="Fitness"
                        />
                    </div>
                    <div className="lg:hidden flex items-center justify-center">
                        <img
                            className="w-full h-auto object-cover rounded-full"
                            src={PROPER_DIET}
                            alt="Fitness"
                        />
                    </div>
                    </div>
                    </div>
        </section>
    );
};

export default FitnessImportance;