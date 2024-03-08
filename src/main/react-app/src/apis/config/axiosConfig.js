import axios from "axios"

export const baseURL = process.env.REACT_APP_API_URL;

export const api = axios.create({baseURL, withCredentials: true})

// defining a custom error handler for all APIs
const errorHandler = (error) => {
    const statusCode = error.response?.status

    // logging only errors that are not 401
    if (statusCode && statusCode !== 401) {
        console.error(error)
    }

    return Promise.reject(error)
}

export const csrfInterceptor = (config) => {
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
    const csrfTokenValue = csrfToken?.split('=')[1];
    if (csrfTokenValue) {
        config.headers['X-XSRF-TOKEN'] = csrfTokenValue;
    }
    return config;
}


api.interceptors.request.use(csrfInterceptor);
// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, errorHandler)