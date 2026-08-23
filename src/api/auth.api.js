import api from "./axios";

export const authApi = {
    register(payload) {
        return api.post("/auth/register", payload);
    },

    login(payload) {
        return api.post("/auth/login", payload);
    },

    refresh(refreshToken) {
        return api.post("/auth/refresh", {
            refresh_token: refreshToken,
        });
    },

    me() {
        return api.get("/auth/me");
    },

    logout() {
        return api.post("/auth/logout");
    },

    logoutAll() {
        return api.post("/auth/logout-all");
    },
};