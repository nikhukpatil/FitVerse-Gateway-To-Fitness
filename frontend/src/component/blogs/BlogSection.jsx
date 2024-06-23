import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/config';
import Loader from '../../common/Loader';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const Top = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchBlogs = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/blog/`, {
        params: { page, limit: 6 }
      });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/blog/popularBlogs`);
        setPopularBlogs(response.data.blogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular blogs:', error);
        setLoading(false);
      }
    };

    fetchPopularBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleBlogClick = async (blogID) => {
    try {
      await axios.post(`${API_URL}/api/blog/clickCount/${blogID}`);
      Top();
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  };

  const truncateContent = (content) => {
    const words = content.split(' ');
    return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : content;
  };

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options).replace(',', `'`);
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <h1 className="text-3xl font-semibold capitalize lg:text-4xl mb-10 text-center text-red-500">Blogs</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className='w-20 h-20'>
              <Loader />
            </div>
          </div>
        ) : (
          <>
            {blogs.length === 0 ? (
              <div className="text-center text-lg">No blogs available for now.</div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog, index) => (
                    <div key={index} className="p-4">
                      <div className="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
                        <div className="overflow-hidden">
                          <img className="w-full h-40 md:h-48 lg:h-56 object-cover object-top transition-transform duration-400 hover:scale-105" src={blog.blogImage.url} alt={blog.title} />
                        </div>
                        <div className="p-6">
                          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">Blog by: {blog?.userName}</h2>
                          <h1 className="title-font text-lg font-medium text-gray-600 mb-3">{blog.title}</h1>
                          <p className="leading-relaxed mb-3">{truncateContent(blog.summary)}</p>
                          <div className="flex items-center flex-wrap mb-3">
                            <Link
                              to={`/blog/${blog._id}`}
                              className="bg-gradient-to-r from-red-400 to-red-400 text-white hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg"
                              onClick={() => handleBlogClick(blog._id)}
                            >
                              Read More
                            </Link>
                          </div>
                          <span className="text-sm">On: {formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <button
                      className={`px-4 py-2 mx-1 ${currentPage === 1 ? 'bg-gray-300' : 'bg-red-500 text-white'}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 mx-1 ${index + 1 === currentPage ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      className={`px-4 py-2 mx-1 ${currentPage === totalPages ? 'bg-gray-300' : 'bg-red-500 text-white'}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <h2 className="text-2xl font-semibold capitalize mt-12 lg:text-3xl text-center text-red-500">Popular Blogs</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className='w-20 h-20'>
              <Loader />
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
                {popularBlogs.length === 0 ? (
                  <div className="text-center text-lg col-span-3">No popular blogs available for now.</div>
                ) : (
                  popularBlogs.map((blog, index) => (
                    <div key={index} className="p-4">
                      <div className="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
                        <div className="overflow-hidden">
                          <img className="w-full h-40 md:h-48 lg:h-56 object-cover object-top transition-transform duration-400 hover:scale-105" src={blog.blogImage.url} alt={blog.title} />
                        </div>
                        <div className="p-6">
                          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">{blog?.userName}</h2>
                          <h1 className="title-font text-lg font-medium text-gray-600 mb-3">{blog.title}</h1>
                          <p className="leading-relaxed mb-3">{truncateContent(blog.summary)}</p>
                          <div className="flex items-center flex-wrap">
                            <Link
                              to={`/blog/${blog._id}`}
                              className="bg-gradient-to-r from-red-400 to-red-400 text-white hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg"
                              onClick={() => handleBlogClick(blog._id)}
                            >
                              Read More
                            </Link>
                          </div>
                          <span className="text-sm">On: {formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default BlogSection;