import React from 'react'
import Hero from '../component/home/Hero';
import About from '../component/home/About';
import OurTeam from '../component/home/OurTeam';
import FitnessImportance from '../component/home/FitnessImportance';
import { Helmet } from 'react-helmet'

const HomePage = () => {
  return (
    <>
     <Helmet>
        <title>
          Fitverse
        </title>
      </Helmet>
    <Hero/>
    <FitnessImportance/>
    <About/>
    <OurTeam/>
    </>
  )
}

export default HomePage