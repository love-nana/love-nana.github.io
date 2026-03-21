<template>
  <div class="notification-container">
    <transition-group name="slide">
      <div
        v-for="notification in uiStore.notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        @click="uiStore.removeNotification(notification.id)"
      >
        <div class="notification-icon">
          <span v-if="notification.type === 'success'">✓</span>
          <span v-else-if="notification.type === 'error'">✕</span>
          <span v-else-if="notification.type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification {
  min-width: 280px;
  max-width: 360px;
  padding: 14px 18px;
  border-radius: 10px;
  background: #FAFAFA;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.1),
    0 0 0 1px rgba(201, 169, 110, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notification:hover {
  transform: translateX(-4px);
  box-shadow:
    0 6px 16px rgba(0,0,0,0.12),
    0 0 0 1px rgba(201, 169, 110, 0.3);
}

.notification-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  color: #fff;
}

.notification-success .notification-icon {
  background: #8B4557;
}

.notification-error .notification-icon {
  background: #c0392b;
}

.notification-warning .notification-icon {
  background: #C9A96E;
}

.notification-info .notification-icon {
  background: #A65D6A;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 2px;
  color: #8B4557;
  font-family: Georgia, serif;
}

.notification-message {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
