// Development Environment
// const API_URL = 'http://localhost:4005';


// Production Environment
const API_URL = 'https://fitversebackend.onrender.com';

const token = JSON.parse(localStorage.getItem('token'));

const config = {
  headers: {
    "Content-type": "application/json",
    "Authorization": token,
  },
};

module.exports={
    config,
    API_URL
};