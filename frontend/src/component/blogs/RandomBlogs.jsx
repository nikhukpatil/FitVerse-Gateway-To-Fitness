import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import { API_URL } from '../../config/config';
import Loader from '../../common/Loader';

const RandomBlogs = () => {
  const [randomBlogs, setRandomBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/blog/randomBlogs`);
        setRandomBlogs(response.data.blogs);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch random blogs');
        setLoading(false);
      }
    };

    fetchRandomBlogs();
  }, []);

  const handleBlogClick = async (blogID) => {
    try {
      await axios.post(`${API_URL}/api/blog/clickCount/${blogID}`);
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  };

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
    <div className="random-blogs p-4">
      <h2 className="text-2xl font-semibold mb-4">You may also like</h2>
      <div className="flex flex-col space-y-4">
        {randomBlogs.map((blog) => (
          <Link
            to={`/blog/${blog._id}`}
            key={blog._id}
            className="block p-4 rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            onClick={() => handleBlogClick(blog._id)}
          >
            <div className="flex flex-col h-full">
              <img className="h-24 w-full object-cover object-top rounded" src={blog.blogImage.url} alt={blog.title} />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-medium mb-2">{blog.title}</h3>
                <ReactQuill
                  value={truncateContent(blog.summary)}
                  readOnly={true}
                  theme="bubble"
                  modules={{ toolbar: false }}
                  className="flex-grow"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RandomBlogs;
