import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from "@/components/LoginForm.vue"
import RegisterForm from "@/components/RegisterForm.vue"
import Dashboard from "@/views/Dashboard.vue"
import Profile from "@/components/Profile.vue"
import EditProfile from "@/components/EditProfile.vue";

const routes = [
    { path: '/', component: LoginForm },
    { path: '/register', component: RegisterForm },
    { path: '/dashboard', component: Dashboard },
    {
        path: '/profile/:id',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/edit-profile/:id',    // <-- yeni rota
        name: 'EditProfile',
        component: EditProfile
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
