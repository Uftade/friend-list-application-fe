<template>
  <transition name="fade-slide">
    <div class="login-form" v-if="show">
      <h2>Giriş Yap</h2>
      <form @submit.prevent="loginUser">
        <div class="form-group">
          <label for="userName">Kullanıcı Adı</label>
          <input v-model="user.userName" id="userName" placeholder="Kullanıcı adınızı girin" required />
        </div>

        <div class="form-group">
          <label for="password">Şifre</label>
          <div class="password-container">
            <input
                :type="showPassword ? 'text' : 'password'"
                v-model="user.password"
                id="password"
                placeholder="Şifrenizi girin"
                required
            />
            <button type="button" @click="togglePasswordVisibility">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <button type="submit" class="login-button">Giriş Yap</button>

        <router-link to="/register" class="register-link">Kayıt Ol</router-link>

        <p v-if="message" class="error-message">{{ message }}</p>
      </form>
    </div>
  </transition>

  <!-- Java Akademi 16 animasyon kutusu -->
  <div class="akademi-box">
    <div class="akademi-text">Java Akademi 16</div>
  </div>

  <!-- Özlü söz -->
  <div class="quote-text">Başarı, küçük çabaların tekrarıdır. - Robert Collier</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const user = ref({
  userName: '',
  password: ''
})

const message = ref('')
const showPassword = ref(false)
const router = useRouter()
const show = ref(false)

onMounted(() => {
  show.value = true // form yavaşça görünsün
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const loginUser = async () => {
  try {
    const response = await axios.post('http://localhost:8080/User/login', user.value)
    localStorage.setItem('loggedInUser', JSON.stringify(response.data))
    router.push('/dashboard')
  } catch (error) {
    message.value = 'Giriş başarısız: Kullanıcı adı veya şifre hatalı.'
  }
}
</script>

<style scoped>
/* Animasyon tanımı */
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

/* Form stili */
.login-form {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.password-container {
  display: flex;
  align-items: center;
}

.password-container input {
  flex: 1;
}

.password-container button {
  margin-left: 0.5rem;
  padding: 0.5rem 0.7rem;
  font-size: 1rem;
  background-color: #ddd;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.password-container button:hover {
  background-color: #ccc;
}

.login-button {
  width: 100%;
  padding: 0.7rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

.login-button:hover {
  background-color: #45a049;
}

.register-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.error-message {
  color: #b00020;
  background-color: #fdecea;
  padding: 0.7rem;
  margin-top: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  text-align: center;
}

/* Java Akademi 16 animasyon kutusu */
.akademi-box {
  position: absolute;
  bottom: 50px; /* Sayfanın alt kısmına yerleştir */
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-size: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: -50px; /* Kutu biraz yukarı kayacak */
  white-space: nowrap; /* Yazının tek satırda kalmasını sağlar */
}

.akademi-text {
  display: inline-block;
  //animation: textSlide 6s linear infinite;
}

/*@keyframes textSlide {
  0% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}*/

/* Özlü söz */
.quote-text {
  position: absolute;
  top: 500px; /* Sayfanın üst kısmına yerleştir */
  left: 40%;
  transform: translateX(-50%);
  font-size: 1.4rem;
  color: #1976d2;
  animation: quoteSlide 12s linear infinite; /* 12s süre ile sağa sola kayma, döngü ile */
}
@keyframes quoteSlide {
  0% {
    transform: translateX(40%); /* Başlangıç: Sağdan başla */
  }
  25% {
    transform: translateX(0); /* Ortada dur: Daha uzun süre durması için 25% */
  }
  50% {
    transform: translateX(-40%); /* Soldan çıkış: Aynı hızda */
  }
  75% {
    transform: translateX(0); /* Ortada dur: Daha uzun süre durması için 25% */
  }
  100% {
    transform: translateX(40%); /* Sağdan tekrar başla */
  }
}

</style>
