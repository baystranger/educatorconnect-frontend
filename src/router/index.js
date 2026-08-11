import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Register from '../views/Register.vue'

import Center from '../views/Center.vue'

const routes = [
  { path: '/', name: 'home', component: LandingPage },
  { path: '/register', name: 'register', component: Register},
  { path: '/center', name: 'center', component: Center }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
