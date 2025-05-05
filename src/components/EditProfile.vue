<template>
  <div class="edit-profile">
    <!-- X simgesi sağ üst köşede -->
    <button class="close-button" @click="goBack">×</button>

    <h2>Profili Düzenle</h2>

    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Ad Soyad</label>
        <input v-model="user.name" id="name" required />
      </div>

      <div class="form-group">
        <label for="userName">Kullanıcı Adı</label>
        <input v-model="user.userName" id="userName" required />
      </div>

      <div class="form-group">
        <label for="profileImage">Profil Resmi (dosya adı)</label>
        <input v-model="user.profileImage" id="profileImage" placeholder="ör: avatar1.jpg" />
      </div>

      <button type="submit" class="save-button">Kaydet</button>

      <p v-if="message" class="status-message">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const user = ref({
  name: '',
  userName: '',
  profileImage: ''
})
const message = ref('')
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await axios.get(`http://localhost:8080/User/${id}`)
    user.value = res.data
  } catch (err) {
    message.value = 'Kullanıcı bilgileri alınamadı: ' + err.message
  }
})

const updateProfile = async () => {
  try {
    await axios.put(`http://localhost:8080/User/update/${route.params.id}`, user.value)
    message.value = 'Profil başarıyla güncellendi!'
  } catch (err) {
    message.value = 'Güncelleme başarısız: ' + err.message
  }
}

const goBack = () => {
  router.push(`/profile/${route.params.id}`)
}
</script>

<style scoped>
.edit-profile {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f4f4f4;
  border-radius: 10px;
  border: 1px solid #ccc;
  position: relative;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.save-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.status-message {
  margin-top: 1rem;
  text-align: center;
  color: #333;
}

/* X simgesi stil */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #000;
}
</style>
