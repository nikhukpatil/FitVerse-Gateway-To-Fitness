import axios from 'axios'
import { API_URL, config } from '../../../config/config'


const signin = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/signin`, userData)
    if (response.data) {
        localStorage.setItem('token', JSON.stringify(response.data.token));
    }
    return response.data

}


const getUser = async () => {
    const response = await axios.get(`${API_URL}/api/user/`, config)
    if (response.data) {
        localStorage.setItem('token', JSON.stringify(response.data.token));
    }
    return response.data
}

const signOut = async () => {
    localStorage.removeItem('token');
    return;
};

const saveBMI = async (BMIData) => {
    const response = await axios.post(`${API_URL}/api/user/`, BMIData, config)
    return response.data;
}

const deleteBMI = async (BMIId) => {
    const response = await axios.delete(`${API_URL}/api/user/${BMIId}`, config)
    return response.data;
}

const uploadAvatar = async (image) => {
    const response = await axios.post(`${API_URL}/api/user/uploadavatar`, image, config)
    return response.data;
}

const updateUser = async (user) => {
    try {
        const response = await axios.patch(`${API_URL}/api/user/`, user, config)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const forgotPasswordWithEmail = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/forgotPasswordWithEmail`, data);
        return response.data
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (data) => {
    try {
        const response = await axios.put(`${API_URL}/api/user/change-password`, data, config);
        return response.data
    } catch (error) {
        throw error;
    }
}

const authService = {
    signin,
    signOut,
    getUser,
    updateUser,
    saveBMI,
    deleteBMI,
    uploadAvatar,
    forgotPasswordWithEmail,
    changePassword
}

export default authService