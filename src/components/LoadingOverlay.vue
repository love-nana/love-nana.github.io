<template>
  <transition name="fade">
    <div v-if="uiStore.loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-circle"></div>
        </div>
        <div class="loading-text">{{ uiStore.loadingText }}</div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(250, 245, 239, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 16px;
  position: relative;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid #E5D4B3;
  border-top: 3px solid #8B4557;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #8B4557;
  font-size: 0.95rem;
  font-family: Georgia, serif;
  letter-spacing: 1px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
