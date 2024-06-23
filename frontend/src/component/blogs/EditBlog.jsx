import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../../common/Loader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';

const compressImage = async (file, maxSizeInBytes) => {
    const options = {
        maxSizeMB: maxSizeInBytes / (1024 * 1024),
        maxWidthOrHeight: 1024,
        useWebWorker: true,
    };

    if (file.size <= maxSizeInBytes) {
        return file;
    }

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        throw error;
    }
};

const EditBlog = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogImage, setBlogImage] = useState(null);
    const [initialTitle, setInitialTitle] = useState('');
    const [initialSummary, setInitialSummary] = useState('');
    const [initialBlogContent, setInitialBlogContent] = useState('');
    const [initialBlogImage, setInitialBlogImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/blog/getBlogById/${id}`, config);
                setTitle(response?.data?.blog.title || '');
                setInitialTitle(response?.data?.blog.title || '');
                setSummary(response?.data?.blog.summary || '');
                setInitialSummary(response?.data?.blog.summary || '');
                setBlogContent(response?.data?.blog?.blogContent || '');
                setInitialBlogContent(response?.data?.blog?.blogContent || '');
                setInitialBlogImage(response?.data?.blog?.blogImage || '');
                setImagePreview(response?.data?.blog?.blogImage?.url || '');
            } catch (error) {
                toast.error(error.response.data.message);
            }
        };

        fetchBlog();
    }, [id]);

    const handleUpdate = async () => {
        try {
            setLoading(true);

            let hasUpdates = false;
            const formData = new FormData();

            if (title !== initialTitle) {
                formData.append('title', title);
                hasUpdates = true;
            }
            if (summary !== initialSummary) {
                formData.append('summary', summary);
                hasUpdates = true;
            }

            if (blogContent !== initialBlogContent) {
                formData.append('blogContent', blogContent);
                hasUpdates = true;
            }

            if (blogImage) {
                const compressedFile = await compressImage(blogImage, 1024 * 1024);
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const imageDataUrl = reader.result;
                    formData.append('blogImage', imageDataUrl);
                    hasUpdates = true;

                    if (!hasUpdates) {
                        setLoading(false);
                        toast.error('No changes made to the blog');
                        return;
                    }

                    for (let [key, value] of formData.entries()) {
                        console.log(`${key}: ${value instanceof File ? value.name : value}`);
                    }

                    try {
                        const response = await axios.put(`${API_URL}/api/blog/${id}`, formData, config);
                        toast.success(response.data.message);
                        navigate(`/blog/${id}`);
                    } catch (error) {
                        toast.error(error.response?.data?.message);
                    } finally {
                        setLoading(false);
                    }
                };
                reader.readAsDataURL(compressedFile);
            }
        } catch (error) {
            console.error('Image compression error:', error);
            toast.error('Error compressing image.');
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setBlogImage(selectedImage);
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedImage);
    };

    return (
        <div className=" mx-auto p-6 rounded-lg relative">
            {loading && (
                <div className="fixed inset-0 overflow-hidden w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-50">
                    <div className='h-40 w-40'>
                    <Loader />
                    </div>
                </div>
            )}
            <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
            <form>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        maxLength={100}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Summary"
                        maxLength={200}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                        required
                    />
                </div>
                <div>
                    <ReactQuill
                        value={blogContent}
                        onChange={setBlogContent}
                        className="w-full mb-4"
                        theme="snow"
                        modules={{
                            toolbar: [
                                [{ header: '1' }, { header: '2' }, { font: [] }],
                                [{ size: [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'image'],
                                ['clean'],
                            ],
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="blogImageUpload" className="block mb-2">Blog Image</label>
                    <label htmlFor="blogImageUpload" className="cursor-pointer block w-96 h-96 rounded-md overflow-hidden mb-4">
                        {imagePreview || initialBlogImage ? (
                            <img src={imagePreview || initialBlogImage?.url} alt="Blog" className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Selected</div>
                        )}
                    </label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        id="blogImageUpload"
                        className="hidden"
                    />
                </div>

                <div className="flex justify-center mt-4 space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/blogs')}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBlog;
