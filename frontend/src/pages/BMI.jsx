import React from 'react'
import BmiIntro from '../component/bmi/BmiIntro'
import { Helmet } from 'react-helmet'

const BMI = () => {
  return (
    <div>
       <Helmet>
        <title>
          BMI - Fitverse
        </title>
      </Helmet>
      <BmiIntro/>
    </div>
  )
}

export default BMI
