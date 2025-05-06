import { createRouter, createWebHistory } from 'vue-router'

// Bileşenleri içe aktar
import Main from '@/components/Main.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import ListUser from '@/components/ListUser.vue'
import Profile from '@/components/Profile.vue'

const routes = [
    { path: '/', component: Main },
    { path: '/register', component: RegisterForm },
    { path: '/list', component: ListUser },
    { path: '/profile/:id', component: Profile, props: true }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
