import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, config } from '../config/config'
import { toast } from 'react-hot-toast'
import { Helmet } from 'react-helmet'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await axios.post(`${API_URL}/api/user/contact-us`, formData, config)

        toast.success(response.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setErrors({});
      } catch (error) {
        toast.error(error.response.data.message);
      }

    }
  };

  return (
    <>
      <Helmet>
        <title>
          Contact Us - Fitverse
        </title>
      </Helmet>
      <div className="mx-auto my-14 grid grid-cols-1 md:grid-cols-3 h-fit w-4/5 md:w-[90%] lg:w-4/5 rounded shadow overflow-hidden text-white">
        <div className="p-2 md:p-4 h-full bg-gray-800 col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row  justify-center gap-4 items-start md:items-center pt-8 p-4">
              <h2 className="text-2xl md:text-3xl font-semibold">Send Us A Message</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-mail-forward"
                width="33"
                height="33"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#fff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 18h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5" />
                <path d="M3 6l9 6l9 -6" />
                <path d="M15 18h6" />
                <path d="M18 15l3 3l-3 3" />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-4 md:py-12 md:px-8 text-sm">
              <div className="flex flex-col gap-1">
                <label className="font-semibold">
                  Name <span className="text-red-500">&#42;</span>
                </label>
                <input
                  className="border-[1px] border-white bg-gray-800 p-2 rounded-md"
                  placeholder="Enter Your Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="text-red-500">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold">
                  Email <span className="text-red-500">&#42;</span>
                </label>
                <input
                  className="border-[1px] border-white bg-gray-800 p-2 rounded-md"
                  placeholder="Enter Your Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="text-red-500">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold">
                  Phone <span className="text-red-500">&#42;</span>
                </label>
                <input
                  className="border-[1px] border-white bg-gray-800 p-2 rounded-md"
                  placeholder="Enter Your Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="text-red-500">{errors.phone}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold">
                  Subject <span className="text-red-500">&#42;</span>
                </label>
                <input
                  className="border-[1px] border-white bg-gray-800 p-2 rounded-md"
                  placeholder="Enter Your Subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <span className="text-red-500">{errors.subject}</span>}
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-semibold">
                  Message <span className="text-red-500">&#42;</span>
                </label>
                <textarea
                  className="border-[1px] border-white bg-gray-800 p-2 rounded-md"
                  placeholder="Enter Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <span className="text-red-500">{errors.message}</span>}
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end px-8">
              <button
                type="submit"
                className="py-2 px-4 md:py-4 md:px-6 bg-gray-800 rounded-md border-2 border-white flex items-center gap-2 hover:scale-95 transition-all"
              >
                <span className="text-xl">Submit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-brand-telegram"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#fff"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="py-6 px-4 h-[300px] md:h-full bg-red-800 grid grid-cols-1 grid-rows-5">
          <h2 className="text-xl lg:text-2xl text-center font-semibold">Contact Information</h2>

          <div className="row-span-4 flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-mail-share"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#fff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M13 19h-8a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v6" />
              <path d="M3 7l9 6l9 -6" />
              <path d="M16 22l5 -5" />
              <path d="M21 21.5v-4.5h-4.5" />
            </svg>
            <a href="mailto:webdevbynikhil+fitverse@gmail.com" className="sm:text-base text-xs">webdevbynikhil+fitverse@gmail.com</a>
            <p>We will contact you within 2-3 days.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact