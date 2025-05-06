<template>
  <div v-if="user">
    <h2>{{ user.username }}'in Profili</h2>
    <p>Email: {{ user.email }}</p>
    <!-- Diğer bilgiler -->
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      user: null,
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      const id = this.$route.params.id;
      fetch(`/api/users/${id}`)
          .then(response => response.json())
          .then(data => {
            this.user = data;
          })
          .catch(error => console.error("Profil yüklenemedi:", error));
    },
  },
};
</script>