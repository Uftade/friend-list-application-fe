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
          style="display: flex; align-items: center; gap: 10px;"
      >
        <!-- Profil Fotoğrafı -->
        <img
            :src="user.imageUrl ? `http://localhost:8080/${user.imageUrl}` : defaultImage"
            alt="profil"
            class="profile-image"
        />

        <!-- Kullanıcı Adı -->
        {{ user.name }} ({{ user.userName }})
        <span v-if="showLink[index]">
          <router-link :to="`/profile/${user.userId}`">{{ user.name }}</router-link>
        </span>
      </li>
    </ul>
    <p v-else>Henüz kullanıcı yok.</p>

    <!-- Gelen Arkadaşlık İsteklerini Göster -->
    <PendingRequests :user-id="loggedInUser.userId" />

    <!-- Arkadaşlarım Listesi -->
    <FriendsList :user-id="loggedInUser.userId" :users="users" />

    <!-- İstek attıklarım Listesi -->
    <SentRequests :user-id="loggedInUser.userId" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PendingRequests from '../components/PendingRequests.vue'
import FriendsList from '../components/FriendsList.vue'
import SentRequests from "@/components/SentRequests.vue"

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
const users = ref([])
const showLink = ref([])
const defaultImage = '/default-user.png' // public klasörüne default-user.png ekle

onMounted(() => {
  fetchUsers()
})

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/User/all')
    users.value = response.data.filter(
        (user) => user.userId !== loggedInUser?.userId
    )
    showLink.value = new Array(users.value.length).fill(false)
  } catch (error) {
    console.error('Kullanıcılar alınamadı:', error)
  }
}
</script>

<style scoped>
.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
