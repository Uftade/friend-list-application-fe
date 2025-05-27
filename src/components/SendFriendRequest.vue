<template>
  <div>
    <button :disabled="buttonDisabled" v-if="checkButtonDisabled" @click="sendFriendRequest">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  requesterId: Number,
  recieverId: Number
})

const status = ref('LOADING')
const buttonText = ref('Yükleniyor...')
const buttonDisabled = ref(true)

const checkStatus = async () => {
  if (!props.requesterId || !props.recieverId) return

  try {
    const response = await axios.get('http://localhost:8080/friendship/status', {
      params: {
        requesterId: props.requesterId,
        receiverId: props.recieverId
      }
    })

    status.value = response.data.status || 'NONE'
    updateButton()
  } catch (error) {
    console.error('Durum sorgusu hatası:', error)
    status.value = 'NONE'
    updateButton()
  }
}

const checkButtonDisabled = () => {
  if(props.requesterId === !props.recieverId) return false
}

const updateButton = () => {
  if (status.value === 'PENDING') {
    buttonText.value = 'İstek Gönderildi'
    buttonDisabled.value = true
  } else if (status.value === 'ACCEPTED') {
    buttonText.value = 'Zaten Arkadaşsınız'
    buttonDisabled.value = true
  } else {
    buttonText.value = 'İstek Gönder'
    buttonDisabled.value = false
  }
}

const sendFriendRequest = async () => {
  try {
    await axios.post('http://localhost:8080/friendship/add', {
      requesterId: props.requesterId,
      recieverId: props.recieverId
    })
    status.value = 'PENDING'
    updateButton()
  } catch (error) {
    console.error('İstek gönderilemedi:', error)
  }
}

// İlk yüklendiğinde durumu kontrol et
onMounted(() => {
  checkStatus()
})

// recieverId her değiştiğinde yeniden kontrol et (dinamik yapı için)
watch(() => props.recieverId, () => {
  checkStatus()
})
</script>

<style scoped>
button {
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
