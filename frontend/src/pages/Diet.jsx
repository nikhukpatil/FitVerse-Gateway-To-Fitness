import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, config } from '../config/config';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ERROR from '../constants/ErrorConstants';
import { Helmet } from 'react-helmet'

const Diet = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState('');
    const [gender, setGender] = useState('');
    const [dietPreference, setDietPreference] = useState('');
    const [dietGoal, setDietGoal] = useState('');
    const [exercise, setExercise] = useState('');
    const [sendInstructions, setSendInstructions] = useState(false);
    const [errors, setErrors] = useState({});
    const { auth } = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!height) newErrors.height = 'Height is required';
        if (!weight) newErrors.weight = 'Weight is required';
        if (!bmi) newErrors.bmi = 'BMI is required';
        if (!gender) newErrors.gender = 'Gender is required';
        if (!dietPreference) newErrors.dietPreference = 'Diet preference is required';
        if (!dietGoal) newErrors.dietGoal = 'Diet goal is required';
        if (!exercise) newErrors.exercise = 'Exercise type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!auth) {
            setShowModal(true);
            return;
        }
        if (!validateForm()) {
            toast.error(ERROR.REQUIRED_DETAILS);
            return;
        }

        const formData = {
            height,
            weight,
            bmi,
            gender,
            dietPreference,
            dietGoal,
            exercise,
            sendInstructions,
        };

        try {
            const response = await axios.post(`${API_URL}/api/dietplan`, formData, config);
            toast.success(response.data.message);

            // Clear all fields after successful submission
            setHeight('');
            setWeight('');
            setBmi('');
            setGender('');
            setDietPreference('');
            setDietGoal('');
            setExercise('');
            setSendInstructions(false);
            setErrors({});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (!auth) {
            setShowModal(true);
        }
    };

    const handleCheckboxChange = (e) => {
        setSendInstructions(e.target.checked);
        if (!auth) {
            setShowModal(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-10">
            <Helmet>
                <title>
                    Diet Plan Request - Fitverse
                </title>
            </Helmet>
            <div className="max-w-4xl w-full p-8 bg-slate-300 shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Diet: Importance and Benefits</h2>
                <p className="text-lg mb-6 text-gray-700 text-center">
                    A balanced diet is vital for our overall health and well-being. It provides the necessary nutrients that our body needs to function correctly. A good diet can improve our physical and mental health, increase energy levels, and reduce the risk of chronic diseases. By understanding our dietary needs and making informed choices, we can maintain a healthy lifestyle. Our experts will guide you to maintain a diet tailored to your needs, whether you aim to lose weight, maintain your current weight, or gain weight.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="height">Height (cm)</label>
                            <input
                                id="height"
                                type="number"
                                value={height}
                                onChange={handleInputChange(setHeight)}
                                className={`w-full p-2 border bg-gray-200 ${errors.height ? 'border-red-500' : 'border-gray-300'} rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500`}
                            />
                            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="weight">Weight (kg)</label>
                            <input
                                id="weight"
                                type="number"
                                value={weight}
                                onChange={handleInputChange(setWeight)}
                                className={`w-full p-2 border bg-gray-200 ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500`}
                            />
                            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="bmi">BMI</label>
                            <input
                                id="bmi"
                                type="number"
                                value={bmi}
                                onChange={handleInputChange(setBmi)}
                                className={`w-full p-2 border bg-gray-200 ${errors.bmi ? 'border-red-500' : 'border-gray-300'} rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500`}
                            />
                            {errors.bmi && <p className="text-red-500 text-sm mt-1">{errors.bmi}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={handleInputChange(setGender)}
                            className={`w-full p-2 border bg-gray-200 ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500`}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="dietPreference">Diet Preference</label>
                        <select
                            id="dietPreference"
                            value={dietPreference}
                            onChange={handleInputChange(setDietPreference)}
                            className={`w-full p-2 border bg-gray-200 ${errors.dietPreference ? 'border-red-500' : 'border-gray-300'} rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500`}
                        >
                            <option value="">Select Diet</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                        </select>
                        {errors.dietPreference && <p className="text-red-500 text-sm mt-1">{errors.dietPreference}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="dietGoal">Diet Goal</label>
                        <select
                            id="dietGoal"
                            value={dietGoal}
                            onChange={handleInputChange(setDietGoal)}
                            className={`w-full p-2 border bg-gray-200 ${errors.dietGoal ? 'border-red-500' : 'border-gray-300'} rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500`}
                        >
                            <option value="">Select Goal</option>
                            <option value="Losing Weight">Losing Weight</option>
                            <option value="Maintaining Weight">Maintaining Weight</option>
                            <option value="Gaining Weight">Gaining Weight</option>
                        </select>
                        {errors.dietGoal && <p className="text-red-500 text-sm mt-1">{errors.dietGoal}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="exercise">Exercise Type</label>
                        <select
                            id="exercise"
                            value={exercise}
                            onChange={handleInputChange(setExercise)}
                            className={`w-full p-2 border bg-gray-200 ${errors.exercise ? 'border-red-500' : 'border-gray-300'} rounded mt-1 focus:outline-none focus:ring-2 focus:ring-red-500`}
                        >
                            <option value="">Select Exercise Type</option>
                            <option value="Light">Light</option>
                            <option value="Medium">Medium</option>
                            <option value="Extreme">Extreme</option>
                        </select>
                        {errors.exercise && <p className="text-red-500 text-sm mt-1">{errors.exercise}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="sendInstructions"
                            type="checkbox"
                            checked={sendInstructions}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <label htmlFor="sendInstructions" className="ml-2 block text-sm text-gray-900">
                            Also send me instructions on mail
                        </label>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-bold mb-4">This feature is only for FitVerse users. Please login and try again.</h3>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Diet;