import axios from "axios";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

const api = axios.create({
  baseURL: "https://nano-backend-64lgb.ondigitalocean.app/",
});

const firebaseTokenInterceptor = async (config) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
        try {
            const token = await user.getIdToken();
            config.headers["Authorization"] = `Bearer ${token}`;
        } catch (error) {
            console.error("Error getting Firebase token:", error);
        }
    }

    return config;
};

api.interceptors.request.use(firebaseTokenInterceptor);

export const apiService = {
    get: (url, config) => api.get(url, config),
    post: (url, data, config) => api.post(url, data, config),
    put: (url, data, config) => api.put(url, data, config),
    delete: (url, config) => api.delete(url, config),
    patch: (url, data, config) => api.patch(url, data, config),
};
