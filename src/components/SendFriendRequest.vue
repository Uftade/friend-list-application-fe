<template>
  <div>
    <h2>Arkadaşlık İsteği Gönder</h2>
    <p>Gönderen ID: {{ requesterId }}</p>
    <input type="number" v-model="recieverId" placeholder="Receiver ID" required />
    <button @click="sendFriendRequest" :disabled="loading">İstek Gönder</button>
    <p v-if="message" :class="messageType">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import axios from 'axios'

const props = defineProps({
  requesterId: Number
})

const recieverId = ref(null)
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const sendFriendRequest = async () => {
  if (!props.requesterId || !recieverId.value) {
    message.value = 'Lütfen alıcı ID girin.'
    messageType.value = 'error'
    return
  }

  loading.value = true
  try {
    const response = await axios.post('http://localhost:8080/friendship/add', {
      requesterId: props.requesterId,
      recieverId: recieverId.value
    })

    message.value = 'Arkadaşlık isteği başarıyla gönderildi!'
    messageType.value = 'success'
    recieverId.value = null

  } catch (error) {
    message.value = 'İstek gönderilemedi: ' + error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

p.success {
  color: green;
}

p.error {
  color: red;
}
</style>
