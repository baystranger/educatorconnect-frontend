import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'

import Center from '../views/Center.vue'
import Register from '../views/auth/Register.vue'
import { useAuthStore } from '../stores/auth.store.js'
import Login from '../views/auth/Login.vue'
import RoleDashboard from '../views/RoleDashboard.vue'

const routes = [
    { path: '/', name: 'home', component: LandingPage },
    { path: '/login', name: 'login', component: Login, meta: { guest: true } },
    { path: '/register', name: 'register', component: Register, meta: { guest: true } },
    { path: '/center', name: 'center', component: Center },
    { path: '/dashboard', name: 'admin.dashboard', component: RoleDashboard, meta: { requiresAuth: true, roles: ['admin', 'administrator', 'childcare', 'educator', 'professional'] } },
    { path: '/childcare/profile', name: 'childcare.profile', component: RoleDashboard, meta: { requiresAuth: true, section: 'profile', roles: ['childcare'] } },
    { path: '/childcare/jobs/new', name: 'childcare.jobs.new', component: RoleDashboard, meta: { requiresAuth: true, roles: ['childcare'] } },
    { path: '/childcare/applications', name: 'childcare.applications', component: RoleDashboard, meta: { requiresAuth: true, roles: ['childcare'] } },
    { path: '/childcare/inquiries', name: 'childcare.inquiries', component: RoleDashboard, meta: { requiresAuth: true, roles: ['childcare'] } },
    { path: '/childcare/practicum', name: 'childcare.practicum', component: RoleDashboard, meta: { requiresAuth: true, roles: ['childcare'] } },
    { path: '/educator/profile', name: 'educator.profile', component: RoleDashboard, meta: { requiresAuth: true, roles: ['educator'] } },
    { path: '/educator/applications', name: 'educator.applications', component: RoleDashboard, meta: { requiresAuth: true, roles: ['educator'] } },
    { path: '/educator/saved-jobs', name: 'educator.saved-jobs', component: RoleDashboard, meta: { requiresAuth: true, roles: ['educator'] } },
    { path: '/educator/practicum', name: 'educator.practicum', component: RoleDashboard, meta: { requiresAuth: true, roles: ['educator'] } },
    { path: '/professional/profile', name: 'professional.profile', component: RoleDashboard, meta: { requiresAuth: true, roles: ['professional'] } },
    { path: '/professionals/claim', name: 'professional.claim', component: RoleDashboard, meta: { requiresAuth: true, roles: ['professional'] } },
    { path: '/professionals', name: 'professionals', component: RoleDashboard, meta: { requiresAuth: true, roles: ['professional'] } },
    { path: '/jobs', name: 'jobs', component: RoleDashboard, meta: { requiresAuth: true, roles: ['educator', 'childcare', 'admin'] } },
    { path: '/account/settings', name: 'account.settings', component: RoleDashboard, meta: { requiresAuth: true, roles: ['childcare', 'educator', 'professional'] } },
    { path: '/forbidden', name: 'forbidden', component: RoleDashboard, meta: { requiresAuth: true } },
    { path: '/admin/:section', name: 'admin.section', component: RoleDashboard, meta: { requiresAuth: true, roles: ['admin', 'administrator'] } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {

    const authStore = useAuthStore();

    /*
    |--------------------------------------------------------------------------
    | Restore authentication
    |--------------------------------------------------------------------------
    */

    if (!authStore.initialized) {
        await authStore.initialize();
    }


    /*
    |--------------------------------------------------------------------------
    | Guest-only pages
    |--------------------------------------------------------------------------
    */

    if (
        to.meta.guest &&
        authStore.isAuthenticated
    ) {
        return redirectAuthenticatedUser(
            authStore
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Protected page
    |--------------------------------------------------------------------------
    */

    if (
        to.meta.requiresAuth &&
        !authStore.isAuthenticated
    ) {
        return {
            name: "login",
            query: {
                redirect: to.fullPath,
            },
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Role protection
    |--------------------------------------------------------------------------
    */

    if (to.meta.roles) {

        const allowedRoles = to.meta.roles;

        if (
            !allowedRoles.includes(
                authStore.role
            )
        ) {
            return {
                name: "forbidden",
            };
        }
    }

    return true;
});


function redirectAuthenticatedUser(
    authStore
) {
    return { name: "home" };
}

export default router
