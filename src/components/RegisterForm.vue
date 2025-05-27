<template>
  <transition name="fade-slide">
    <div class="register-container" v-if="show">
      <h2>Kayıt Ol</h2>
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label>Ad Soyad:</label>
          <input v-model="user.name" placeholder="Adınızı girin" required />
        </div>
        <div class="form-group">
          <label>Kullanıcı Adı:</label>
          <input v-model="user.userName"  placeholder="Kullanıcı adınızı girin" required />
        </div>
        <div class="form-group">
          <label>Şifre:</label>
          <input type="password" v-model="user.password" placeholder="Şifrenizi girin" required />
        </div>
        <div class="form-group">
          <label>Profil Resmi (örnek: onur.jpg):</label>
          <input v-model="user.profileImage" placeholder="onur.jpg" />
        </div>
        <button type="submit">Kayıt Ol</button>
      </form>
      <p v-if="message">{{ message }}</p>
      <button @click="goToLogin" class="back-button">Geri Dön</button>
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = reactive({
  name: '',
  userName: '',
  password: '',
  profileImage: ''
})

const message = ref('')
const show = ref(false)

onMounted(() => {
  show.value = true
})

const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:8080/users/save', user)
    message.value = `Kayıt başarılı! Hoş geldin, ${response.data.name}`
    router.push('/')
  } catch (error) {
    message.value = 'Kayıt başarısız: ' + error.message
  }
}

const goToLogin = () => {
  router.push('/')
}
</script>

<style scoped>
/* Fade-slide animasyonu */
.fade-slide-enter-active {
  animation: fadeSlideIn 0.6s ease-out forwards;
}
.fade-slide-leave-active {
  opacity: 0;
}
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.3rem;
  font-weight: bold;
  color: #333;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  margin-top: 1rem;
  padding: 0.6rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.back-button {
  background-color: #2196f3;
  margin-top: 1rem;
}

.back-button:hover {
  background-color: #1976d2;
}

p {
  margin-top: 1rem;
  color: #333;
}
</style>
