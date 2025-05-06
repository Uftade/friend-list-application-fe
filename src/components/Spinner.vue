 <template>
  <div class="spinner-container">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

.spinner {
  border: 4px solid #ccc;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
