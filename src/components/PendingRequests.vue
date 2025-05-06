<template>
  <div>
    <h2>Gelen Arkadaşlık İstekleri</h2>
    <div v-if="pending.length === 0">Hiç istek yok.</div>
    <ul v-else>
      <li v-for="req in pending" :key="req.friendshipId">
        Gönderen: {{ getUserName(req.requesterId) }}
        <button @click="accept(req.friendshipId)">✅ Kabul Et</button>
        <button @click="reject(req.friendshipId)">❌ Reddet</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import axios from 'axios'

const props = defineProps({
  userId: Number
})

const pending = ref([])
const usersMap = ref({})  // ID -> user objesi

const fetchPending = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/friendship/pending/${props.userId}`)
    pending.value = response.data

    // Her bir requesterId için kullanıcı verisi çek
    const ids = [...new Set(response.data.map(r => r.requesterId))]
    const userRequests = await Promise.all(ids.map(id =>
        axios.get(`http://localhost:8080/User/${id}`)
    ))

    userRequests.forEach(res => {
      const user = res.data
      usersMap.value[user.userId] = user
    })
  } catch (err) {
    console.error("İstekler alınamadı:", err.message)
  }
}

const getUserName = (id) => {
  const user = usersMap.value[id]
  return user ? `${user.name} (${user.userName})` : `Kullanıcı ID: ${id}`
}

const accept = async (id) => {
  try {
    await axios.post(`http://localhost:8080/friendship/accept`, {friendshipId: id})
    await fetchPending()
  } catch (err) {
    console.error("Kabul edilemedi:", err.message)
  }
}

const reject = async (id) => {
  try {
    await axios.post(`http://localhost:8080/friendship/reject`, {friendshipId: id})
    await fetchPending()
  } catch (err) {
    console.error("Reddedilemedi:", err.message)
  }
}

onMounted(fetchPending)
</script>
