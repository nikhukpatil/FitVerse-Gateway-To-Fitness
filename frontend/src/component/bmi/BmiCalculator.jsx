import React, { useState } from 'react';
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getUser, resetMessage, saveBMI } from '../../Redux/features/auth/authSlice';
import constants from '../../constants/ImageConstants'

const BmiCalculator = () => {
    const dispatch = useDispatch();
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [BMI, setBMI] = useState('')
    const [isCalculated, setIsCalculated] = useState(false);
    const BMI_CHART = constants.BMICALCULATOR.BMI_CHART

    const calculateBMI = (e) => {
        e.preventDefault();
        if (height <= 0 || weight <= 0 || isNaN(height) || isNaN(weight)) {
            toast.error('Please enter valid height and weight');
            return;
        }
        // Parse height and weight as floats
        const parsedHeight = parseFloat(height);
        const parsedWeight = parseFloat(weight);
        let bmiIndex = parsedWeight / ((parsedHeight / 100) * (parsedHeight / 100));

        let calculatedBMI = bmiIndex.toFixed(2);
        if (bmiIndex < 18.6) {
          setBMI(`${calculatedBMI} (Under Weight)`);
          setIsCalculated(true);
      } else if (bmiIndex >= 18.6 && bmiIndex <= 24.9) {
          setBMI(`${calculatedBMI} (Normal)`);
          setIsCalculated(true);
      } else {
          setBMI(`${calculatedBMI} (Overweight)`);
          setIsCalculated(true);
      }
    };


    const handleSaveBmi = () => {
      dispatch(saveBMI({ height, weight, BMI })).then((response) => {
        if (response.error) {
          toast.error(response.payload);
          dispatch(resetMessage());
        } else {
          dispatch(getUser())
          toast.success(response.payload.message);
          setHeight('');
          setWeight('');
          setBMI('');
          setIsCalculated(false);
        }
      });
    };

    return (
        <div className='flex sm:flex-row flex-col justify-center sm:gap-20 gap-10 w-full'>
            <form className='sm:w-[300px] flex flex-col justify-center' onSubmit={calculateBMI}>
                <fieldset className="flex flex-col md:gap-2 gap-1">
                    <legend className=' md:text-2xl font-bold mb-5 text-center'>Calculate Your BMI</legend>
                    <label htmlFor='height' className="text-xs font-bold after:content-['*'] after:text-red-400">Height</label>
                    <input className=" p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-red-500" type="number" id='height' required={true} placeholder="in cm" value={height} onChange={(e) => { setHeight(e.target.value) }} />
                    <label htmlFor='weight' className="text-xs font-bold after:content-['*'] after:text-red-400">Weight</label>
                    <input className=" p-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-red-500 mb-4" type="number" id='weight' required={true} placeholder="in kg" value={weight} onChange={(e) => { setWeight(e.target.value) }} />
                    <button type="submit" className="rounded bg-red-500 text-indigo-50 p-2 text-center font-bold hover:bg-red-400">Calculate</button>
                </fieldset>
                <p className=' w-full text-center mt-5'>Enter height and weight to see you BMI</p>
            {isCalculated &&
            <div className='mt-3 flex'>
                <button onClick={handleSaveBmi} className='  border border-red-500 bg-red-400 w-20'>Save</button>
                <p className='w-full text-center  text-red-500'>Your BMI is {BMI}</p>
            </div>
            }
            </form>

            <div className=' sm:w-[900px] flex justify-center'>
            <img src={BMI_CHART} alt="BMI chart index" className='' />

            </div>
        </div>
    )
}

export default BmiCalculator
