import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/config';
import Loader from '../../common/Loader';

const PopularBlogs = () => {
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/blog/`);
        setPopularBlogs(response.data.blogs);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch popular blogs');
        setLoading(false);
      }
    };

    fetchPopularBlogs();
  }, []);

  const truncateContent = (content) => {
    const words = content.split(' ');
    return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : content;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="popular-blogs p-4">
      <h2 className="text-2xl font-semibold mb-4">Popular Blogs</h2>
      <div className="flex flex-col space-y-4">
        {popularBlogs.map((blog) => (
          <Link to={`/blog/${blog._id}`} key={blog._id} className="block p-4 rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img className="h-24 w-full object-cover object-center rounded" src={blog.blogImage.url} alt={blog.title} />
            <div className="p-4">
              <h3 className="text-xl font-medium">{blog.title}</h3>
              <p className="text-sm">{truncateContent(blog.Summary)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularBlogs;
