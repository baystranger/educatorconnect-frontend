import { defineStore } from "pinia";
import { authApi } from "../api/auth.api";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: JSON.parse(
            localStorage.getItem("user") || "null"
        ),

        accessToken:
            localStorage.getItem("access_token") || null,

        refreshToken:
            localStorage.getItem("refresh_token") || null,

        loading: false,

        initialized: false,
    }),

    getters: {
        isAuthenticated: (state) => {
            return !!state.accessToken && !!state.user;
        },

        role: (state) => {
            return normalizeRole(state.user?.role);
        },

        isAdmin: (state) => {
            return ["admin", "administrator"].includes(normalizeRole(state.user?.role));
        },

        isChildcare: (state) => {
            return normalizeRole(state.user?.role) === "childcare";
        },

        isEducator: (state) => {
            return normalizeRole(state.user?.role) === "educator";
        },

        isProfessional: (state) => {
            return normalizeRole(state.user?.role) === "professional";
        },
    },

    actions: {
        /*
        |--------------------------------------------------------------------------
        | Register
        |--------------------------------------------------------------------------
        */

        async register(payload) {
            this.loading = true;

            try {
                const response = await authApi.register(payload);
                console.log(response, 'here is the response');                
                const data = response.data.data;

                console.log(data, 'here is the data');
                

                this.setAuthentication(data);

                return response;
            } finally {
                this.loading = false;
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Login
        |--------------------------------------------------------------------------
        */

        async login(payload) {
            this.loading = true;

            try {
                const response =
                    await authApi.login(payload);

                const data = response.data.data;

                this.setAuthentication(data);

                return response;
            } finally {
                this.loading = false;
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Get current user
        |--------------------------------------------------------------------------
        */

        async fetchUser() {
            try {
                const response =
                    await authApi.me();

                this.user = normalizeUser(
                    response.data.data.user
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(this.user)
                );

                return this.user;
            } catch (error) {
                this.clearAuthentication();

                throw error;
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Refresh
        |--------------------------------------------------------------------------
        */

        async refresh() {
            if (!this.refreshToken) {
                throw new Error(
                    "Refresh token is not available."
                );
            }

            const response =
                await authApi.refresh(
                    this.refreshToken
                );

            const data = response.data.data;

            this.setAuthentication(data);

            return data;
        },

        /*
        |--------------------------------------------------------------------------
        | Logout
        |--------------------------------------------------------------------------
        */

        async logout() {
            try {
                await authApi.logout();
            } finally {
                this.clearAuthentication();
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Logout all devices
        |--------------------------------------------------------------------------
        */

        async logoutAll() {
            try {
                await authApi.logoutAll();
            } finally {
                this.clearAuthentication();
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Store authentication data
        |--------------------------------------------------------------------------
        */

        setAuthentication(data) {
            this.accessToken =
                data.access_token;

            this.refreshToken =
                data.refresh_token;

            this.user = normalizeUser(data.user);

            localStorage.setItem(
                "access_token",
                data.access_token
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );
        },

        /*
        |--------------------------------------------------------------------------
        | Clear authentication
        |--------------------------------------------------------------------------
        */

        clearAuthentication() {
            this.user = null;
            this.accessToken = null;
            this.refreshToken = null;

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );

            localStorage.removeItem("user");
        },

        /*
        |--------------------------------------------------------------------------
        | Initialize authentication
        |--------------------------------------------------------------------------
        */

        async initialize() {
            if (this.initialized) {
                return;
            }

            this.initialized = true;

            if (!this.accessToken) {
                return;
            }

            try {
                await this.fetchUser();
            } catch (error) {
                this.clearAuthentication();
            }
        },
    },
});

function normalizeRole(role) {
    if (role === "center" || role === "centre") return "childcare";
    if (role === "parent" || role === "parents") return null;
    return role;
}

function normalizeUser(user) {
    return user ? { ...user, role: normalizeRole(user.role) } : user;
}