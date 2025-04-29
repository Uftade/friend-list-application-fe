<template>
  <div>
    <h2>Gelen Arkadaşlık İstekleri</h2>
    <div v-if="pending.length === 0">Hiç istek yok.</div>
    <ul v-else>
      <li v-for="req in pending" :key="req.friendshipId">
        Gönderen ID: {{ req.requesterId }}
        <button @click="accept(req.friendshipId)">✅ Kabul Et</button>
        <button @click="reject(req.friendshipId)">❌ Reddet</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Giriş yapan kullanıcının ID'si dışarıdan alınacak
const props = defineProps({
  userId: Number
})

const pending = ref([])

const fetchPending = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/friendship/pending/${props.userId}`)
    pending.value = response.data
  } catch (err) {
    console.error("İstekler alınamadı:", err.message)
  }
}

const accept = async (id) => {
  try {
    await axios.post(`http://localhost:8080/friendship/accept`, { friendshipId: id })
    await fetchPending()
  } catch (err) {
    console.error("Kabul edilemedi:", err.message)
  }
}

const reject = async (id) => {
  try {
    await axios.post(`http://localhost:8080/friendship/reject`, { friendshipId: id })
    await fetchPending()
  } catch (err) {
    console.error("Reddedilemedi:", err.message)
  }
}

onMounted(fetchPending)
</script>
