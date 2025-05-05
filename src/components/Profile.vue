<template>
  <div class="profile-container" v-if="user && !isLoading">
    <div class="profile-card">
      <h1>{{ user.name }} ({{ user.userName }})</h1>

      <!-- Profil resmi -->
      <div v-if="user.profileImage">
        <img :src="`http://localhost:8080/${user.profileImage}`" alt="Profil Fotoğrafı" class="profile-img"/>
      </div>

      <p><strong>Ad Soyad:</strong> {{ user.name }}</p>
      <p><strong>Kullanıcı Adı:</strong> {{ user.userName }}</p>

      <div v-if="loggedInUserId !== user.userId">
        <button v-if="!hasPendingRequest && !isAlreadyFriend" @click="sendFriendRequest">Arkadaşlık İsteği Gönder</button>
        <span v-else-if="hasPendingRequest" style="color: gray;">İstek zaten gönderildi</span>
        <span v-else style="color: green;">Zaten arkadaşsınız</span>
        <button @click="goBack" class="back-btn">Geri Dön</button>
      </div>

      <div v-else>
        <button @click="goBack" class="back-btn">Geri Dön</button>
      </div>
    </div>
  </div>

  <p v-if="isLoading" class="loading">Profil bilgileri yükleniyor...</p>
  <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const user = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const hasPendingRequest = ref(false)
const isAlreadyFriend = ref(false)

const route = useRoute()
const router = useRouter()

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
const loggedInUserId = loggedInUser?.userId

onMounted(() => {
  const userId = route.params.id
  fetchUserProfile(userId)
})

const fetchUserProfile = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/User/${id}`)
    user.value = response.data
    await checkFriendStatus()
  } catch (error) {
    errorMessage.value = 'Profil alınırken bir hata oluştu: ' + error.message
  } finally {
    isLoading.value = false
  }
}

const checkFriendStatus = async () => {
  try {
    const pending = await axios.get(`http://localhost:8080/friendship/pending/${user.value.userId}`)
    hasPendingRequest.value = pending.data.some(req =>
        req.requesterId === loggedInUserId && req.receiverId === user.value.userId
    )

    const friends = await axios.get(`http://localhost:8080/friendship/friends/${loggedInUserId}`)
    isAlreadyFriend.value = friends.data.some(friend =>
        (friend.requesterId === loggedInUserId && friend.receiverId === user.value.userId) ||
        (friend.receiverId === loggedInUserId && friend.requesterId === user.value.userId)
    )
  } catch (err) {
    console.error("Arkadaşlık durumu kontrol edilemedi:", err)
  }
}

const sendFriendRequest = async () => {
  try {
    const payload = {
      requesterId: loggedInUserId,
      recieverId: user.value.userId
    }
    await axios.post('http://localhost:8080/friendship/add', payload)
    hasPendingRequest.value = true
    alert('Arkadaşlık isteği gönderildi!')
  } catch (err) {
    alert('İstek gönderilirken hata oluştu: ' + err.message)
  }
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: url('/Background.png') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', sans-serif;
}

.profile-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.profile-img {
  max-width: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid #ddd;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
}

p {
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #444;
}

button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.05);
}

button:not(.back-btn) {
  background-color: #4caf50;
  color: white;
}

.back-btn {
  background-color: #1976d2;
  color: white;
  margin-left: 0.5rem;
}

.back-btn:hover {
  background-color: #1565c0;
}

.loading {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.2rem;
}

.error {
  text-align: center;
  color: red;
  margin-top: 1rem;
}
</style>
