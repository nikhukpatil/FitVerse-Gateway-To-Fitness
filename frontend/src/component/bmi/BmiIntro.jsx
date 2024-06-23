import React from 'react'
import BmiCalculator from './BmiCalculator'

const BmiIntro = () => {
    const benefits = [
        {
            id: 1,
            name: 'Health Assessment:',
            description: 'BMI serves as an initial indicator of potential health risks associated with weight. Individuals with BMI values outside the normal range may be at higher risk for conditions such as cardiovascular disease, type 2 diabetes, and hypertension.'
        },
        {
            id: 2,
            name: 'Monitoring Weight Management:',
            description: 'For individuals striving to achieve or maintain a healthy weight, BMI provides a benchmark for tracking progress over time. By regularly monitoring changes in BMI, individuals can assess the effectiveness of their lifestyle modifications and adjust their approach accordingly.'
        },
        {
            id: 3,
            name: 'Early Intervention:',
            description: 'Detecting abnormal BMI levels early allows for timely intervention to prevent or manage weight-related health issues. Healthcare professionals can provide personalized guidance on nutrition, exercise, and behavior changes to help individuals achieve a healthier BMI and reduce their risk of chronic diseases.'
        },
        {
            id: 4,
            name: 'Population Health Planning:',
            description: 'Aggregate BMI data collected from populations enables public health officials to assess the prevalence of obesity and overweight within communities. This information informs the development of targeted interventions and policies aimed at promoting healthy behaviors and reducing the burden of obesity-related diseases.'
        },
    ]
    return (
        <div className=' sm:px-10 px-5 py-10'>
            <h1 className='flex w-full justify-center sm:text-5xl text-2xl font-bold mb-6'>What is BMI? (Body Mass Index)</h1>

            <p className='mb-10 text-justify'>
                Body Mass Index (BMI) is a numerical value derived from an individual's weight and height. It's a widely used tool in healthcare and fitness circles to assess whether a person's weight falls within a healthy range relative to their height. BMI serves as an initial screening method to identify potential weight-related health risks and guide further evaluation and intervention.While BMI provides a useful snapshot of weight status, it's important to note that it has limitations. For example, BMI does not distinguish between fat mass and lean body mass, so individuals with high muscle mass may have a higher BMI without being overweight or obese. Additionally, BMI may not accurately reflect health risks for certain populations, such as athletes or older adults.
            </p>

<BmiCalculator/>
            <h2 className=' text-2xl font-bold mb-5 mt-10'>Benefits of BMI:</h2>
            {
                benefits.map((benefits)=>{
                    return <div key={benefits.id} className=' mb-4'>
                        <p className='mb-1 font-bold text-lg'> {benefits.id}. {benefits.name}</p>
                        <p >{benefits.description}</p>
                    </div>
                })
            }
        </div>


    )
}

export default BmiIntro
