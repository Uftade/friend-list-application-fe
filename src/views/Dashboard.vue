<template>
  <div class="dashboard-container">
    <h1>👋 Hoş Geldiniz, {{ loggedInUser?.value?.name || 'Giriş yapan kullanıcı bulunamadı' }}</h1>
    v
    <!-- Arkadaşlar -->
    <section v-if="friends.length > 0">
      <h2>Arkadaşlarınız</h2>
      <div class="scrollable-grid">
        <div v-for="friend in friends" :key="friend.userId" class="user-card friend">
          <strong>{{ friend.name }}</strong>
          <p>{{ friend.userName }}</p>
          <button class="remove-button" @click="removeFriend(friend.userId)">Çıkar</button>
        </div>
      </div>
    </section>

    <section>
      <h2>Sistemdeki Kullanıcılar</h2>
      <div class="scrollable-grid">
        <div
            v-for="(user, index) in users"
            :key="user.userId"
            class="user-card"
        >
          <strong>{{ user.name }}</strong>
          <p>{{ user.userName }}</p>
          <router-link :to="`/profile/${user.userId}`">Profili Gör</router-link>

          <!-- 💡 Sadece başka kullanıcılar için istek gönderme bileşeni -->
          <SendFriendRequest
              v-if="user.userId !== loggedInUser.value?.userId"
              :requester-id="loggedInUser.value?.userId"
              :reciever-id="user.userId"
          />



        </div>
      </div>
    </section>

    <!-- Bekleyen İstekler -->
    <section>
      <h2>Bekleyen Arkadaşlık İstekleri</h2>
      <ul class="pending-list" v-if="pendingRequests.length > 0">
        <li v-for="request in pendingRequests" :key="request.friendshipId">
          <span>{{ request.requesterName }} arkadaşlık isteği gönderdi.</span>
          <button @click="acceptRequest(request.friendshipId)">Kabul Et</button>
          <button class="reject" @click="rejectRequest(request.friendshipId)">Reddet</button>
        </li>
      </ul>
      <p v-else>Henüz arkadaşlık isteği yok.</p>
    </section>

    <!-- Çıkış Yap -->
    <button class="logout-button" @click="logout">Çıkış Yap</button>
  </div>
  <button @click="testSecureEndpoint" class="test-button">🔒 Güvenli Alanı Test Et</button>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import SendFriendRequest from '@/components/SendFriendRequest.vue'


const router = useRouter()
const loggedInUser = ref(JSON.parse(localStorage.getItem('loggedInUser')))
const users = ref([])
const friends = ref([])
const pendingRequests = ref([])

onMounted(() => {
  const userStr = localStorage.getItem("loggedInUser");
  if (userStr) {
    loggedInUser.value = JSON.parse(userStr);
    fetchUsers();
    fetchFriends();
    fetchPendingRequests();
  } else {
    alert("Giriş yapan kullanıcı bulunamadı");
    router.push("/");
  }
});

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/users/list')
    users.value = response.data
  } catch (error) {
    console.error('Kullanıcılar alınırken hata:', error)
  }
}
const testSecureEndpoint = async () => {
  try {
    const response = await axios.get("http://localhost:8080/users/secure");
    alert(response.data); // ✅ Başarılı erişim mesajı
  } catch (err) {
    alert("❌ Güvenli alana erişim reddedildi.");
  }
};

const removeFriend = async (friendId) => {
  try {
    // FriendshipId'yi bulmak için backend'e sorgu at
    const response = await axios.get(`http://localhost:8080/friendship/friends/${loggedInUser.value.userId}`)
    const friendship = response.data.find(f =>
        (f.requesterId === friendId && f.receiverId === loggedInUser.value.userId) ||
        (f.receiverId === friendId && f.requesterId === loggedInUser.userId)
    )

    if (friendship) {
      await axios.post('http://localhost:8080/friendship/remove', {
        friendshipId: friendship.friendshipId
      })
      fetchFriends()
    } else {
      console.warn('Arkadaşlık bulunamadı.')
    }
  } catch (error) {
    console.error('Silme sırasında hata:', error)
  }
}

const fetchFriends = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/friendship/friends/${loggedInUser.value.userId}`)
    friends.value = response.data
  } catch (error) {
    console.error('Arkadaşlar alınırken hata:', error)
  }
}

const fetchPendingRequests = async () => {
  try {
    const userId = loggedInUser.value?.userId
    if (!userId) {
      console.warn("Giriş yapan kullanıcı bulunamadı. İstek yapılmadı.")
      return
    }

    const response = await axios.get(`http://localhost:8080/friendship/pending/${userId}`)
    for (let request of response.data) {
      const userResponse = await axios.get(`http://localhost:8080/users/${request.requesterId}`)
      request.requesterName = userResponse.data.userName
    }
    pendingRequests.value = response.data
  } catch (error) {
    console.error('İstekler alınırken hata:', error)
  }
}


const acceptRequest = async (friendshipId) => {
  await axios.post('http://localhost:8080/friendship/accept', { friendshipId })
  fetchPendingRequests()
  fetchFriends()
}

const rejectRequest = async (friendshipId) => {
  await axios.post('http://localhost:8080/friendship/reject', { friendshipId })
  fetchPendingRequests()
}

const logout = () => {
  localStorage.removeItem('loggedInUser')
  router.push('/')
}
</script>

<style scoped>
.dashboard-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.scrollable-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
}

.user-card {
  padding: 1rem;
  border: 1px solid #aaa;
  border-radius: 8px;
  background-color: #fdfdfd;
  text-align: center;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.05);
}

.user-card.friend {
  background-color: #e0f7e9;
}

.user-card a {
  display: inline-block;
  margin-top: 0.5rem;
  color: #1976d2;
  font-size: 0.9rem;
  text-decoration: none;
}

.user-card a:hover {
  text-decoration: underline;
}

.pending-list {
  list-style: none;
  padding-left: 0;
}


.pending-list li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

button {
  margin-left: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}
.remove-button {
  margin-top: 0.5rem;
  background-color: #f44336;
}
.remove-button:hover {
  background-color: #e53935;
}


button:hover {
  background-color: #45a049;
}

.logout-button {
  margin-top: 2rem;
  background-color: #f44336;
}

.logout-button:hover {
  background-color: #e53935;
}
button.reject {
  background-color: #f44336;
}

button.reject:hover {
  background-color: #e53935;
}
.test-button {
  padding: 0.6rem 1.2rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  margin-top: 1rem;
  cursor: pointer;
  font-weight: bold;
}
.test-button:hover {
  background-color: #1976d2;
}

</style>
