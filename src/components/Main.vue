<script setup>
import { ref } from 'vue'
import RegisterForm from './RegisterForm.vue'
import SendFriendRequest from './SendFriendRequest.vue'
import PendingRequests from './PendingRequests.vue'
import axios from 'axios'

const username = ref('')
const password = ref('')
const isLoggedIn = ref(false)
const showRegister = ref(false)
const userId = ref(null)

const login = async () => {
  if (!username.value || !password.value) {
    alert('Lütfen kullanıcı adı ve şifre girin.')
    return
  }

  try {
    const response = await axios.post("http://localhost:8080/users/login", {
      userName: username.value,
      password: password.value
    })

    userId.value = response.data.userId
    isLoggedIn.value = true

  } catch (error) {
    alert('Giriş başarısız: ' + error.message)
  }
}

const goToRegister = () => {
  showRegister.value = true
}

const goToLogin = () => {
  showRegister.value = false
}
</script>

<template>
  <div v-if="!isLoggedIn">
    <div v-if="!showRegister">
      <h3>Giriş Yap</h3>
      <input v-model="username" placeholder="Kullanıcı adı"/>
      <input v-model="password" type="password" placeholder="Şifre"/>
      <button @click="login">Giriş Yap</button>
      <br/>
      <button @click="goToRegister">Kayıt Ol</button>
    </div>

    <RegisterForm v-else @kaydoldu="goToLogin"/>
  </div>

  <div v-else>
    <h2>Hoş geldin {{ username }}</h2>

    <SendFriendRequest :requester-id="userId"/>

    <PendingRequests :user-id="userId"/>
  </div>
</template>