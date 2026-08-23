import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth.store";

export function useAuth() {
    const authStore = useAuthStore();

    const {
        user,
        accessToken,
        refreshToken,
        loading,
        initialized,
    } = storeToRefs(authStore);

    const {
        register,
        login,
        logout,
        logoutAll,
        refresh,
        fetchUser,
        initialize,
    } = authStore;

    return {
        user,
        accessToken,
        refreshToken,
        loading,
        initialized,

        isAuthenticated:
            authStore.isAuthenticated,

        role: authStore.role,

        isAdmin: authStore.isAdmin,

        isChildcare:
            authStore.isChildcare,

        isEducator:
            authStore.isEducator,

        isProfessional:
            authStore.isProfessional,

        register,
        login,
        logout,
        logoutAll,
        refresh,
        fetchUser,
        initialize,
    };
}