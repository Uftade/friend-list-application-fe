import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from "@/components/LoginForm.vue"
import RegisterForm from "@/components/RegisterForm.vue"
import Dashboard from "@/views/Dashboard.vue"
import Profile from "@/components/Profile.vue"

const routes = [
    { path: '/', component: LoginForm },
    { path: '/register', component: RegisterForm },
    { path: '/dashboard', component: Dashboard },
    {
        path: '/profile/:id',
        name: 'Profile',
        component: Profile
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
