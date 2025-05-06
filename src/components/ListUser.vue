<template>
  <div class="user-list">
    <h2>Kullanıcılar</h2>
    <ul v-if="users.length">
      <li v-for="user in users" :key="user.userId">
        {{ user.userName }} - {{ user.name }}
        <button @click="goToProfile(user.userId)">Profile Git</button>
      </li>
    </ul>
    <p v-else>Hiç kullanıcı bulunamadı.</p>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
      fetchUsers() {
        fetch('http://localhost:8080/User/list')
            .then(response => response.json())
            .then(data => {
              this.users = data;
            })
            .catch(error => console.error("Kullanıcılar alınırken hata:", error));
      },
      goToProfile(userId) {
        this.$router.push(`/profile/${userId}`);
      },
    },
  };
</script>