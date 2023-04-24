import axios from 'axios';
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    }
});

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    window.location = '/login?session-expired';
}

axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        const unixNow = dayjs().unix();
        // check if access token is expired
        if (unixNow >= jwt_decode(accessToken).exp) {
            const refreshToken = localStorage.getItem('refresh_token');
            // check if refresh token is expired
            if (unixNow >= jwt_decode(refreshToken).exp) {
                logout();
            } else {
                // refresh access token
                try {
                    const {data} = await axios.post(`${baseURL}api/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                } catch (error) {
                    logout();
                }
            }
        }
        config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 Unauthorized
        if (error.response.status === 401) {
            logout();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
