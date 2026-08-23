import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },

    timeout: 30000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        /*
        |--------------------------------------------------------------------------
        | Don't refresh auth endpoints
        |--------------------------------------------------------------------------
        */

        if (
            originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/register") ||
            originalRequest?.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        /*
        |--------------------------------------------------------------------------
        | Access token expired
        |--------------------------------------------------------------------------
        */

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(
                "refresh_token"
            );

            if (!refreshToken) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");

                window.location.href = "/login";

                return Promise.reject(error);
            }

            /*
            |--------------------------------------------------------------------------
            | If another refresh request is already running,
            | wait for it.
            |--------------------------------------------------------------------------
            */

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                    });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization =
                            `Bearer ${token}`;

                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            isRefreshing = true;

            try {
                const response = await api.post(
                    "/auth/refresh",
                    {
                        refresh_token: refreshToken,
                    }
                );

                const data = response.data.data;

                const newAccessToken = data.access_token;
                const newRefreshToken = data.refresh_token;

                localStorage.setItem(
                    "access_token",
                    newAccessToken
                );

                localStorage.setItem(
                    "refresh_token",
                    newRefreshToken
                );

                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;