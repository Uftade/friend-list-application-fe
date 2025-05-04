<template>
  <div class="profile-container" v-if="user && !isLoading">
    <h1>{{ user.name }} ({{ user.userName }})</h1>
    <p><strong>Ad Soyad:</strong> {{ user.name }}</p>
    <p><strong>Kullanıcı Adı:</strong> {{ user.userName }}</p>

    <!-- Butonlar sadece giriş yapan kullanıcı bu profile bakmıyorsa gösterilir -->
    <div v-if="loggedInUserId !== user.userId">
      <button @click="sendFriendRequest">Arkadaşlık İsteği Gönder</button>
      <button @click="goBack">Geri Dön</button>
    </div>
    <!-- Kendine bakıyorsa sadece geri dön butonu görünsün -->
    <div v-else>
      <button @click="goBack">Geri Dön</button>
    </div>
  </div>

  <p v-if="isLoading">Profil bilgileri yükleniyor...</p>
  <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {useRoute, useRouter} from 'vue-router'

const user = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const route = useRoute()
const router = useRouter()

// Giriş yapan kullanıcıyı localStorage'dan al
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
const loggedInUserId = loggedInUser?.userId

// Profil bilgilerini al
onMounted(() => {
  const userId = route.params.id
  fetchUserProfile(userId)
})

const fetchUserProfile = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/User/${id}`)
    user.value = response.data
  } catch (error) {
    errorMessage.value = 'Profil alınırken bir hata oluştu: ' + error.message
  } finally {
    isLoading.value = false
  }
}

// Arkadaşlık isteği gönder
const sendFriendRequest = async () => {
  try {
    const payload = {
      requesterId: loggedInUserId,
      recieverId: user.value.userId
    }
    await axios.post('http://localhost:8080/friendship/add', payload)
    alert('Arkadaşlık isteği gönderildi!')
  } catch (err) {
    alert('İstek gönderilirken hata oluştu: ' + err.message)
  }
}

// Geri dön butonu
const goBack = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  border: none;
  color: white;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>
