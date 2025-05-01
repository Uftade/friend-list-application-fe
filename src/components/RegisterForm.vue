<template>
  <div class="register-container">
    <h2>Kayıt Ol</h2>
    <form @submit.prevent="registerUser">
      <div>
        <label>Ad Soyad:</label>
        <input v-model="user.name" required />
      </div>
      <div>
        <label>Kullanıcı Adı:</label>
        <input v-model="user.userName" required />
      </div>
      <div>
        <label>Şifre:</label>
        <input type="password" v-model="user.password" required />
      </div>
      <button type="submit">Kayıt Ol</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <button @click="goToLogin">Geri Dön</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = reactive({
  name: '',
  userName: '',
  password: ''
})

const message = ref('')

const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:8080/User/save', user)
    message.value = `Kayıt başarılı! Hoş geldin, ${response.data.name}`
    // Giriş yap sayfasına yönlendir
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
.register-container {
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
  margin-top: 1rem;
}
</style>
