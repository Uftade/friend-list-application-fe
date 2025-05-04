<template>
  <div class="login-form">
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
      <button type="submit">Giriş Yap</button>
    </form>
    <p v-if="message">{{ message }}</p>

    <!-- Kayıt Ol butonu sadece giriş yapılmamışsa görünsün -->
    <router-link to="/register">
      <button>Kayıt Ol</button>
    </router-link>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'

const user = ref({
  userName: '',
  password: ''
})

const message = ref('')
const router = useRouter()

const loginUser = async () => {
  try {
    const response = await axios.post('http://localhost:8080/User/login', user.value)

    // Giriş yapan kullanıcıyı localStorage'a kaydet
    localStorage.setItem('loggedInUser', JSON.stringify(response.data))

    // Dashboard sayfasına yönlendir
    router.push('/dashboard')
  } catch (error) {
    message.value = 'Giriş başarısız: ' + error.message
  }
}
</script>

<style scoped>
/* Basit stiller */
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

form div {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>
