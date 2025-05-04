<template>
  <div>
    <h2>Gönderdiğim Bekleyen İstekler</h2>
    <ul v-if="requests.length > 0">
      <li v-for="r in requests" :key="r.friendshipId">
        {{ getReceiverName(r.receiverId) }}
      </li>
    </ul>
    <p v-else>Henüz bekleyen isteğiniz yok.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  userId: Number
})

const requests = ref([])
const allUsers = ref([])

const fetchSentRequests = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/friendship/sent-pending/${props.userId}`)
    requests.value = res.data
  } catch (err) {
    console.error('Bekleyen gönderilen istekler alınamadı:', err)
  }
}

const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:8080/User/all')
    allUsers.value = res.data
  } catch (err) {
    console.error('Kullanıcılar alınamadı:', err)
  }
}

const getReceiverName = (id) => {
  const user = allUsers.value.find(u => u.userId === id)
  return user ? `${user.name} (${user.userName})` : `Kullanıcı ID: ${id}`
}

onMounted(() => {
  fetchSentRequests()
  fetchUsers()
})
</script>
