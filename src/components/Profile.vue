<template>
  <transition name="fade-slide">
    <div class="profile-container" v-if="user && !isLoading">
      <h1>{{ user.name }} ({{ user.userName }})</h1>
      <p><strong>Ad Soyad:</strong> {{ user.name }}</p>
      <p><strong>Kullanıcı Adı:</strong> {{ user.userName }}</p>

      <!-- Profil Resmi -->
      <div class="profile-image">
        <img :src="getProfileImage()" alt="Profil Resmi" />
      </div>

      <!-- Butonlar sadece giriş yapan kullanıcı bu profile bakmıyorsa gösterilir -->
      <div v-if="loggedInUserId !== user.userId">
        <button @click="sendFriendRequest">Arkadaşlık İsteği Gönder</button>
        <button @click="goBack">Geri Dön</button>
      </div>
      <!-- Kendine bakıyorsa sadece geri dön butonu görünsün -->
      <div v-else>
        <button @click="goBack">Geri Dön</button>
        <router-link :to="`/edit-profile/${user.userId}`" class="edit-link">Profili Düzenle</router-link>
      </div>

      <!-- Arkadaşlar Listesi -->
      <div v-if="friends.length > 0" class="friends-list">
        <h3>Arkadaşlar ({{ friends.length }})</h3>
        <ul>
          <li v-for="(friend, index) in friends" :key="friend.userId">
            {{ friend.name }} ({{ friend.userName }})
          </li>
        </ul>
      </div>
      <p v-else>Bu kullanıcının henüz arkadaşı yok.</p>
    </div>
  </transition>

  <p v-if="isLoading">Profil bilgileri yükleniyor...</p>
  <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const user = ref(null)
const friends = ref([])  // Arkadaşlar listesi
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
  fetchFriends(userId)  // Kullanıcının arkadaşlarını alalım
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

// Arkadaşları getir
const fetchFriends = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8080/friendship/friends/${id}`)
    friends.value = response.data
  } catch (error) {
    console.error('Arkadaşlar alınırken bir hata oluştu:', error)
  }
}
const getProfileImage = () => {
  if (user.value?.profileImage) {
    return `/${user.value.profileImage}`  // Örn: /654.jpg
  } else {
    return '/default.jpg'  // public klasörüne bir varsayılan görsel ekleyebilirsin
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
/* Fade-slide animasyonu */
.fade-slide-enter-active {
  animation: fadeSlideIn 0.6s ease-out forwards;
}
.fade-slide-leave-active {
  opacity: 0;
}
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  position: relative; /* Profil resmini sağ üst köşeye yerleştirmek için */
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

h3 {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.friends-list {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #e0f7fa;
  border-radius: 8px;
  border: 1px solid #009688;
}

ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

li {
  padding: 0.5rem;
  font-size: 1rem;
  border-bottom: 1px solid #ccc;
}

li:last-child {
  border-bottom: none;
}

.profile-image {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 120px;
  height: 120px;
  border-radius: 0; /* Artık yuvarlak değil, kare */
  border: 3px solid #333;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

p {
  font-style: normal;
  color: #888;
}
</style>
