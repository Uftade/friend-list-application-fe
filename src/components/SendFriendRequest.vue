<template>
  <div>
    <h2>Arkadaşlık İsteği Gönder</h2>
    <input type="number" v-model="requesterId" placeholder="Requester ID" required />
    <input type="number" v-model="recieverId" placeholder="Receiver ID" required />
    <button @click="sendFriendRequest" :disabled="loading">Send Friend Request</button>
    <p v-if="message" :class="messageType">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios'; // ✅ axios'u import ediyoruz

export default {
  data() {
    return {
      requesterId: null,
      recieverId: null,
      loading: false,
      message: '',
      messageType: '' // 'success' veya 'error' tipi mesajlar için
    };
  },
  methods: {
    async sendFriendRequest() {
      // ID'lerin geçerliliğini kontrol et
      if (!this.requesterId || !this.recieverId) {
        this.message = 'Lütfen her iki ID\'yi de girin.';
        this.messageType = 'error';
        return;
      }

      // Yükleniyor durumunu başlat
      this.loading = true;

      try {
        const response = await axios.post('http://localhost:8080/friendship/add', {
          requesterId: this.requesterId,
          recieverId: this.recieverId
        });

        // Başarı durumunda mesaj
        this.message = 'Arkadaşlık isteği başarıyla gönderildi!';
        this.messageType = 'success';
        console.log('İstek başarıyla gönderildi:', response.data);

        // İstek gönderildikten sonra ID'leri sıfırlayabiliriz
        this.requesterId = null;
        this.recieverId = null;
      } catch (error) {
        // Hata durumunda mesaj
        this.message = 'İstek gönderilirken hata oluştu: ' + error.message;
        this.messageType = 'error';
        console.error('İstek gönderilirken hata oluştu:', error);
      } finally {
        // Yükleniyor durumunu bitir
        this.loading = false;
      }
    }
  }
};
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
