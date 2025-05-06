<script setup>
import { ref } from 'vue'
import RegisterForm from './RegisterForm.vue'
import SendFriendRequest from './SendFriendRequest.vue'
import PendingRequests from './PendingRequests.vue'
import axios from 'axios'
import { useRouter } from "vue-router"

const username = ref('')
const password = ref('')
const isLoggedIn = ref(false)
const showRegister = ref(false)
const userId = ref(null)

const router = useRouter()

// Giriş yapma fonksiyonu
const login = async () => {
  if (!username.value || !password.value) {
    alert('Lütfen kullanıcı adı ve şifre girin.')
    return
  }

  try {
    const response = await axios.post("http://localhost:8080/User/login", {
      userName: username.value,
      password: password.value
    })

    // Login başarılıysa kullanıcı adını ve ID'yi kaydet
    userId.value = response.data.userId
    username.value = response.data.userName  // Kullanıcı adı doğru şekilde alındı
    isLoggedIn.value = true

    // Giriş başarılıysa /list sayfasına yönlendir
    router.push('/list')
  } catch (error) {
    alert('Giriş başarısız: ' + error.message)
  }
}

// Kayıt olma için gösterim
const goToRegister = () => {
  showRegister.value = true
}

// Giriş ekranına dönme
const goToLogin = () => {
  showRegister.value = false
}
</script>

<template>
  <div v-if="!isLoggedIn">
    <!-- Eğer kullanıcı giriş yapmamışsa -->
    <div v-if="!showRegister">
      <h3>Giriş Yap</h3>
      <input v-model="username" placeholder="Kullanıcı adı" />
      <input v-model="password" type="password" placeholder="Şifre" />
      <button @click="login">Giriş Yap</button>
      <br />
      <button @click="goToRegister">Kayıt Ol</button>
    </div>

    <!-- Kayıt formunu göster -->
    <RegisterForm v-else @kaydoldu="goToLogin" />
  </div>

  <div v-else>
    <!-- Kullanıcı giriş yaptıysa -->
    <h2>Hoş geldin {{ username }}</h2>

    <SendFriendRequest :requester-id="userId" />
    <PendingRequests :user-id="userId" />
  </div>
</template>
