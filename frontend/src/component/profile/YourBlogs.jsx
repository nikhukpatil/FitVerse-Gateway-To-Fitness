import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../../common/Loader';
import { Helmet } from 'react-helmet'

const YourBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async (page = 1) => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/blog/getUserBlogs?page=${page}&limit=5`, config);
                setBlogs(response.data.userBlogs);
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
            } catch (error) {
                toast.error('Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs(currentPage);
    }, [currentPage]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/api/blog/${selectedBlog._id}`, config);
            setBlogs(blogs.filter(blog => blog._id !== selectedBlog._id));
            toast.success(response.data.message);
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete blog');
            setShowDeleteModal(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleCreateBlog = () => {
        navigate('/create-blog');
    };

    const openDeleteModal = (blog) => {
        setSelectedBlog(blog);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedBlog(null);
        setShowDeleteModal(false);
    };

    const openReasonModal = (blog) => {
        setSelectedBlog(blog);
        setShowReasonModal(true);
    };

    const closeReasonModal = () => {
        setSelectedBlog(null);
        setShowReasonModal(false);
    };

    return (
        <div className="mx-auto p-6 rounded-lg">
            <Helmet>
                <title>
                    Your Blogs - Fitverse
                </title>
            </Helmet>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Your Blogs</h2>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={handleCreateBlog}
                >
                    Create A Blog
                </button>
            </div>
            {loading ? (
                <div className=' flex justify-center items-center'>
                    <div className=' w-10 h-10'>
                        <Loader />
                    </div>
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center">
                    <p>No blogs found.</p>
                    <p>Would you like to <Link to="/create-blog">create one</Link>?</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {blogs?.map(blog => (
                            <div key={blog?._id} className="p-4 rounded shadow flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                                <img
                                    src={blog?.blogImage?.url}
                                    alt="Blog"
                                    className="w-24 h-24 md:w-12 md:h-12 rounded-full object-cover"
                                />
                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="text-lg font-bold">{blog?.title}</h3>
                                    <p className={`text-xs text-white w-fit px-2 py-1 rounded ${blog?.status === 'Pending' ? 'bg-yellow-500' : blog?.status === 'Verified' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {blog?.status}
                                    </p>
                                </div>
                                <div className="flex space-x-4 text-black">
                                    <Link to={`/blog/${blog._id}`}>
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded">View</button>
                                    </Link>
                                    <Link to={`/edit-blog/${blog._id}`}>
                                        <button
                                            className={`px-4 py-2 bg-green-500 text-white rounded ${blog?.status === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={blog?.status === 'Pending'}
                                        >
                                            Edit
                                        </button>
                                    </Link>
                                    {blog?.status === 'Rejected' && (
                                        <button
                                            className="px-4 py-2 bg-yellow-500 text-white rounded"
                                            onClick={() => openReasonModal(blog)}
                                        >
                                            Reason
                                        </button>
                                    )}
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                        onClick={() => openDeleteModal(blog)}
                                    >
                                        Delete
                                    </button>
                                </div>
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
                </>
            )}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this blog?</h3>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showReasonModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-6 rounded shadow-lg w-1/2">
                        <h3 className="text-lg font-bold mb-4">Rejection Reason</h3>
                        <p className="mb-4">{selectedBlog?.rejectionMessage}</p>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={closeReasonModal}
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

export default YourBlogs;