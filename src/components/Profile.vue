<template>
  <div class="profile-container" v-if="user && !isLoading">
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
      <button @click="goBack">Geri Dön</button>
    </div>

    <div v-else>
      <button @click="goBack">Geri Dön</button>
    </div>
  </div>

  <p v-if="isLoading">Profil bilgileri yükleniyor...</p>
  <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
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
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.profile-img {
  max-width: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
}
</style>
