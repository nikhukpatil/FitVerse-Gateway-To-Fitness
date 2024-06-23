import React from 'react'
import constant from '../../constants/ImageConstants'

const About = () => {
    const ABOUT_FITVERSE = constant.HOME.ABOUT_FITVERSE;
    return (
        <>
            <div className=' md:mt-20 sm:mt-5 mt-1'>
                <div className=' p-10 sm:mb-5 mb-1'>

                    <h1 className='sm:text-2xl text-lg mb-4 font-bold text-red-500'>Unlock Your Fitness Potential with FitVerse: Gateway to Fitness</h1>
                    <p className='sm:text-xl text-sm font-Inter mb-5'>Explore FitVerse, your ultimate gateway to wellness, and immerse yourself in the vibrant world of health and fitness. Our platform is meticulously designed to shed light on the profound significance of fitness and its indispensable role in everyday life. Whether you're taking your first steps on the path to wellness or you're a seasoned enthusiast, we're here to guide you every step of the way.</p>
                    <p className='sm:text-xl text-sm font-Inter mb-5'>Delve into a treasure trove of valuable insights, expert advice, and motivational content tailored to inspire and empower you on your journey to a healthier lifestyle. From comprehensive resources on nutrition and exercise to personalized tools such as BMI and BMR calculators, we provide you with everything you need to make informed decisions about your health.</p>
                    <p className='sm:text-xl text-sm font-Inter'>But we're more than just a platform – we're your dedicated partners in progress. Reach out to us to unlock custom-tailored diet plans designed to fuel your body and elevate your performance. Join us in celebrating the transformative power of fitness as we embark together on the exhilarating path to a happier, healthier you."</p>
                </div>
            </div>
            <div className=' w-full'>
                <img src={ABOUT_FITVERSE} alt="about" className=' w-full' />
            </div>
        </>
    )
}

export default About
