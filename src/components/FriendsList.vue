<template>
  <div>
    <h2>Arkadaşlarım</h2>
    <ul v-if="friends.length > 0">
      <li v-for="f in friends" :key="f.friendshipId">
        <router-link :to="`/profile/${getOtherUser(f).userId}`">
          {{ getOtherUser(f).name }} ({{ getOtherUser(f).userName }})
        </router-link>
      </li>
    </ul>
    <p v-else>Henüz hiç arkadaşın yok.</p>
  </div>
</template>

<script setup>
import { ref, onMounted,  computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  userId: Number,
  users: Array  // dashboarddan gelen kullanıcı listesi
})

const friends = ref([])

const fetchFriends = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/friendship/friends/${props.userId}`)
    friends.value = response.data
  } catch (err) {
    console.error("Arkadaşlar alınamadı:", err.message)
  }
}

const getOtherUser = (f) => {
  const otherId = f.requesterId === props.userId ? f.receiverId : f.requesterId
  return props.users.find(u => u.userId === otherId) || { userId: otherId, name: "Bilinmeyen", userName: "???" }
}

onMounted(fetchFriends)
</script>
