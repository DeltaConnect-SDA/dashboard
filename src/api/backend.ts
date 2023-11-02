import { logout } from "@/context/AuthProvider";
import axios from "axios";

export const publicAPI = axios.create({
    baseURL: process.env.VIITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json'
    },
    timeout: 30000
})

publicAPI.interceptors.response.use(
    function (response) {
        return response;
    }, 
    function (error) {
        if (error.response.status === 401) {
            logout();
        } else if (error.response.status === 403) {
            window.location.href = '/forbidden'
        }
        return Promise.reject(error);

 });

export const authAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}v1/auth/dashboard`,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json'
    },
    timeout: 30000
})