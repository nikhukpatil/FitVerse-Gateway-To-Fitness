import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';
import { toast } from 'react-hot-toast';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Loader from '../../common/Loader';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'

const DietPlans = () => {
    const [dietPlans, setDietPlans] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDetails, setShowDetails] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [selectedDietPlan, setSelectedDietPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDietPlans = async (page = 1) => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/dietplan/?page=${page}&limit=5`, config);
                setDietPlans(response.data.userDietReq);
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchDietPlans(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const toggleDetails = (id) => {
        if (showDetails === id) {
            setShowDetails(null);
        } else {
            setShowDetails(id);
        }
    };

    const handleDeleteClick = (dietPlan) => {
        setSelectedDietPlan(dietPlan);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`${API_URL}/api/dietplan/${selectedDietPlan._id}`, config);
            toast.success(response.data.message);
            setDietPlans(dietPlans.filter(plan => plan._id !== selectedDietPlan._id));
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete diet plan request');
        }
    };

    const handleViewClick = (dietPlan) => {
        setSelectedDietPlan(dietPlan);
        setShowInstructionsModal(true);
    };

    return (
        <div className="mx-auto p-6 rounded-lg">
            <Helmet>
                <title>
                    Diet Plans - Fitverse
                </title>
            </Helmet>
            {loading ? (
                <div className=' flex justify-center items-center'>
                    <div className=' w-10 h-10'>
                        <Loader />
                    </div>
                </div>
            ) : dietPlans.length === 0 ? (
                <div className="text-center">
                    <p>No diet plan request made.</p>
                    <p>Want to make one?</p>
                    <Link to="/diet">Create Diet Plan</Link>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {dietPlans?.map(dietPlan => (
                            <div key={dietPlan?._id} className="p-4 rounded shadow space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-lg font-bold">{dietPlan?.dietGoal}</h3>
                                        <button onClick={() => toggleDetails(dietPlan?._id)}>
                                            {showDetails === dietPlan?._id ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    </div>
                                    {!dietPlan?.responded && (
                                        <p className="text-red-500">Awaiting response</p>
                                    )}
                                    {dietPlan?.responded && (
                                        <p className="text-green-500">Response received</p>
                                    )}
                                    {dietPlan?.responded ? (
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded"
                                            onClick={() => handleViewClick(dietPlan)}
                                        >
                                            View
                                        </button>
                                    ) : (
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded"
                                            onClick={() => handleDeleteClick(dietPlan)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                {showDetails === dietPlan?._id && (
                                    <div className="mt-2">
                                        <p><strong>Height:</strong> {dietPlan?.height} cm</p>
                                        <p><strong>Weight:</strong> {dietPlan?.weight} kg</p>
                                        <p><strong>BMI:</strong> {dietPlan?.bmi}</p>
                                        <p><strong>Gender:</strong> {dietPlan?.gender}</p>
                                        <p><strong>Diet Preference:</strong> {dietPlan?.dietPreference}</p>
                                        <p><strong>Exercise Level:</strong> {dietPlan?.exercise}</p>
                                        {dietPlan?.dietInstructions && (
                                            <p><strong>Diet Instructions:</strong> {dietPlan?.dietInstructions}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                    {showDeleteModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                            <div className="bg-white p-6 rounded-lg">
                                <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this diet plan request?</h2>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                        onClick={handleDeleteConfirm}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showInstructionsModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                            <div className="bg-white p-6 rounded-lg w-1/2">
                                <h2 className="text-lg font-bold mb-4">Diet Instructions</h2>
                                <p>{selectedDietPlan?.dietInstructions}</p>
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded"
                                        onClick={() => setShowInstructionsModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DietPlans;
