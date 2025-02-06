const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

const token = JSON.parse(localStorage.getItem('token'));

const config = {
  headers: {
    'Content-type': 'application/json',
    Authorization: token,
  },
};

module.exports = {
  config,
  API_URL,
};
