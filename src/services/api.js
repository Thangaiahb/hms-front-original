import axios from "axios";

const api = axios.create({
    baseURL: "https://hms-gnp1.onrender.com/api",
});

/* ✅ REQUEST INTERCEPTOR (Attach Token) */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ✅ RESPONSE INTERCEPTOR (Auto Logout if Token Expired) */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;
