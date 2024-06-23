import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';
import { toast } from 'react-hot-toast';
import Loader from '../../common/Loader';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

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
    const compressedFile = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;
          const maxDim = Math.max(width, height);
          if (maxDim > options.maxWidthOrHeight) {
            const scale = options.maxWidthOrHeight / maxDim;
            width *= scale;
            height *= scale;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: file.type }));
              } else {
                reject(new Error('Image compression failed'));
              }
            },
            file.type,
            options.maxSizeMB
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
    return compressedFile;
  } catch (error) {
    throw error;
  }
};

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('')
  const [image, setImage] = useState(null);
  const [blogContent, setBlogContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      toast.error('Please upload a valid image file.');
      setLoading(false);
      return;
    }

    try {
      const compressedFile = await compressImage(image, 1024 * 1024);
      const reader = new FileReader();

      reader.onloadend = async () => {
        const imageDataUrl = reader.result;
        try {
          const response = await axios.post(`${API_URL}/api/blog/`, { title, summary, blogContent, blogImage: imageDataUrl }, config);
          toast.success(response.data.message);
          setLoading(false);
          setTitle('');
          setSummary('')
          setImage(null);
          setBlogContent('');
          setImagePreview(null);
        } catch (error) {
          console.error('Error adding blog:', error);
          toast.error(error.response?.data?.error || 'An error occurred while adding the blog.');
          setLoading(false);
        }
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image compression error:', error);
      toast.error('Error compressing image.');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto mt-5 p-6 rounded-lg shadow-md relative">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25">
          <div className="w-20 h-20">
            <Loader />
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <input
            type="Summary"
            placeholder="Summary"
            value={summary}
            maxLength={200}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex justify-center items-center">
          <input
            type="file"
            onChange={handleImageChange}
            className="hidden"
            id="blog-image-upload"
            required
          />
          <label htmlFor="blog-image-upload" className="cursor-pointer w-52 h-52 rounded-md overflow-hidden bg-gray-200 flex justify-center items-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Selected" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </label>
        </div>
        <div className="mt-4"> {/* Add margin top */}
          <ReactQuill
            theme="snow"
            value={blogContent}
            onChange={setBlogContent}
            className="w-full h-50 px-3 py-2 border bg-white rounded-md"
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'sub' }, { script: 'super' }],
                ['blockquote', 'code-block'],
                [{ align: [] }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            formats={[
              'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'script', 'blockquote', 'code-block', 'align', 'link', 'image',
            ]}
            required
          />
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">Create Blog</button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
