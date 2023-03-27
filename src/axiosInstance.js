import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    }
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalConfig = error.config;
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken && error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            try {
                const {data} = await axios.post(`${baseURL}api/token/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                return axiosInstance(originalConfig);
            } catch (e) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;