import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 🔐 Tüm axios isteklerine token ekle
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

createApp(App).use(router).mount('#app')
