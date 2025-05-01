<template>
  <div class="dashboard-container">
    <h1>Hoş Geldiniz, {{ loggedInUser?.name || 'Giriş yapan kullanıcı bulunamadı' }}</h1>

    <h2>Sistemdeki Kullanıcılar:</h2>
    <ul v-if="users.length > 0">
      <li
          v-for="(user, index) in users"
          :key="user.userId"
          @mouseover="showLink[index] = true"
          @mouseleave="showLink[index] = false"
      >
        {{ user.name }} ({{ user.userName }})
        <span v-if="showLink[index]">
          <router-link :to="`/profile/${user.userId}`">{{ user.name }}</router-link>
        </span>
      </li>
    </ul>
    <p v-else>Henüz kullanıcı yok.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Giriş yapan kullanıcıyı localStorage'dan alıyoruz
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

const users = ref([])
const showLink = ref([])

onMounted(() => {
  fetchUsers()
})

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/User/list')
    users.value = response.data
    showLink.value = new Array(response.data.length).fill(false)
  } catch (error) {
    console.error('Kullanıcılar alınırken bir hata oluştu:', error)
  }
}
</script>
