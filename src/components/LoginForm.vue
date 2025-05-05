<template>
  <div class="page-background">
    <div class="login-form">
      <img src="/default-user.png" alt="Profil" class="profile-img" />
      <h2>Giriş Yap</h2>
      <form @submit.prevent="loginUser">
        <div>
          <label for="userName">Kullanıcı Adı:</label>
          <input v-model="user.userName" id="userName" required />
        </div>
        <div>
          <label for="password">Şifre:</label>
          <input type="password" v-model="user.password" id="password" required />
        </div>
        <button type="submit">🔓 Giriş Yap</button>
      </form>
      <p v-if="message">{{ message }}</p>

      <router-link to="/register">
        <button class="register-btn">📝 Kayıt Ol</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const user = ref({
  userName: '',
  password: ''
})

const message = ref('')
const router = useRouter()

const loginUser = async () => {
  try {
    const response = await axios.post('http://localhost:8080/User/login', user.value)
    localStorage.setItem('loggedInUser', JSON.stringify(response.data))
    router.push('/dashboard')
  } catch (error) {
    message.value = 'Giriş başarısız: ' + error.message
  }
}
</script>

<style scoped>
/* Sayfa arka planı */
.page-background {
  min-height: 100vh;
  background: linear-gradient(120deg, #74ebd5, #acb6e5);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', sans-serif;
}

/* Login form kutusu */
.login-form {
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Profil görseli */
.profile-img {
  width: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

/* Giriş başlığı */
h2 {
  margin-bottom: 1rem;
  font-weight: bold;
}

/* Form inputları */
form div {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 1rem;
}

/* Butonlar */
button {
  padding: 0.6rem 1.2rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #388e3c;
  transform: scale(1.05);
}

/* Kayıt butonu */
.register-btn {
  background-color: #1976D2;
}

.register-btn:hover {
  background-color: #1565C0;
}
</style>
