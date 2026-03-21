import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
}

export const useUiStore = defineStore('ui', () => {
  // 全局 loading
  const loading = ref(false)
  const loadingText = ref('加载中...')

  // 通知列表
  const notifications = ref<Notification[]>([])

  // 显示 loading
  function showLoading(text = '加载中...') {
    loading.value = true
    loadingText.value = text
  }

  // 隐藏 loading
  function hideLoading() {
    loading.value = false
  }

  // 显示通知
  function showNotification(
    type: NotificationType,
    title: string,
    message: string,
    duration = 3000
  ) {
    const id = Date.now().toString()
    notifications.value.push({ id, type, title, message })

    // 自动移除
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  // 移除通知
  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    loading,
    loadingText,
    notifications,
    showLoading,
    hideLoading,
    showNotification,
    removeNotification,
  }
})
