import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/config';
import Loader from '../../common/Loader';
import RandomBlogs from './RandomBlogs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/blog/getVerifiedBlogById/${id}`);
        setBlog(response.data.blog);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row lg:space-x-12 mt-10">
      <div className="lg:w-3/4">
        <div className="mb-4 w-full">
          <h2 className="text-4xl font-semibold text-gray-800 leading-tight">
            {blog?.title}
          </h2>
          <img src={blog?.blogImage?.url} alt="Blog" className=" w-full   object-contain mt-4 rounded-lg" />
        </div>
        <h2 className="text-4xl font-semibold text-gray-800 leading-tight">
            {blog?.summary}
          </h2>
        <div className="text-gray-700 text-lg leading-relaxed mt-4">
          <ReactQuill
            theme="snow"
            value={blog?.blogContent || ''}
            readOnly={true} // Make it read-only
            modules={{
              toolbar: false // Hide the toolbar in read-only mode
            }}
          />
        </div>
      </div>
      <div className="lg:w-1/4 mt-12 lg:mt-0">
        <div className="p-4 border-t border-b md:border md:rounded">
          <RandomBlogs />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
