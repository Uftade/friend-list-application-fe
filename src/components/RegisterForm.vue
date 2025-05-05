<template>
  <div class="page-background">
    <div class="register-container">
      <img src="/default-user.png" alt="Profil" class="profile-img" />
      <h2>Kayıt Ol</h2>
      <form @submit.prevent="registerUser" enctype="multipart/form-data">
        <div>
          <label>Ad Soyad:</label>
          <input v-model="user.name" required />
        </div>
        <div>
          <label>Kullanıcı Adı:</label>
          <input v-model="user.userName" required />
        </div>
        <div>
          <label>Şifre:</label>
          <input type="password" v-model="user.password" required />
        </div>
        <div>
          <label>Profil Fotoğrafı:</label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
        </div>
        <button type="submit" class="submit-btn">📝 Kayıt Ol</button>
      </form>
      <p v-if="message">{{ message }}</p>
      <button @click="goToLogin" class="back-btn">↩ Geri Dön</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = reactive({
  name: '',
  userName: '',
  password: '',
  imagePath: ''
})

const selectedFile = ref(null)
const message = ref('')

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const registerUser = async () => {
  try {
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('file', selectedFile.value)

      const imageRes = await axios.post('http://localhost:8080/User/upload', formData)
      user.imagePath = imageRes.data
    }

    const response = await axios.post('http://localhost:8080/User/save', user)
    message.value = `Kayıt başarılı! Hoş geldin, ${response.data.name}`
    router.push('/')
  } catch (error) {
    message.value = 'Kayıt başarısız: ' + error.message
  }
}

const goToLogin = () => {
  router.push('/')
}
</script>

<style scoped>
/* Arka plan */
.page-background {
  min-height: 100vh;
  background: linear-gradient(to right, #fbc2eb, #a6c1ee); /* pembe → mor-mavi */
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', sans-serif;
}


/* Form kutusu */
.register-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 420px;
  width: 100%;
  text-align: center;
}

/* Profil görseli */
.profile-img {
  width: 90px;
  border-radius: 50%;
  opacity: 0.7;
  margin-bottom: 1rem;
}

/* Başlık */
h2 {
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: #333;
}

/* Form alanları */
form div {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #555;
}

input[type="text"],
input[type="password"],
input[type="file"] {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

/* Butonlar */
button {
  padding: 0.6rem 1.2rem;
  margin-top: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
}

.submit-btn:hover {
  background-color: #388e3c;
  transform: scale(1.05);
}

.back-btn {
  background-color: #1976d2;
  color: white;
  margin-left: 0.5rem;
}

.back-btn:hover {
  background-color: #1565c0;
  transform: scale(1.05);
}
</style>
