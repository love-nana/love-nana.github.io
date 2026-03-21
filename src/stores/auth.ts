import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { CosCredentials } from '@/types'

// 从旧的 localStorage key 读取凭证（兼容旧版本）
function readLegacyCredentials(): CosCredentials | null {
  const secretId = localStorage.getItem('local_cosId')
  const secretKey = localStorage.getItem('local_cosToken')
  const user = localStorage.getItem('local_user')

  if (secretId && secretKey) {
    return { secretId, secretKey, user: user || '娜宝' }
  }
  return null
}

export const useAuthStore = defineStore('auth', () => {
  // 先尝试读取新版格式，再尝试旧版格式
  const saved = localStorage.getItem('cos_auth')
  let parsedValue: CosCredentials | null = null

  if (saved) {
    try {
      parsedValue = JSON.parse(saved)
    } catch {
      // 解析失败，清除无效数据
      localStorage.removeItem('cos_auth')
    }
  }

  const initialValue = parsedValue || readLegacyCredentials()

  const credentials = ref<CosCredentials | null>(initialValue)
  const isLoggedIn = computed(() => !!credentials.value)

  // 同步到 localStorage（新旧格式都保存，确保兼容）
  watch(credentials, (newVal) => {
    if (newVal) {
      // 新版格式
      localStorage.setItem('cos_auth', JSON.stringify(newVal))
      // 旧版格式（兼容旧页面）
      localStorage.setItem('local_cosId', newVal.secretId)
      localStorage.setItem('local_cosToken', newVal.secretKey)
      localStorage.setItem('local_user', newVal.user)
    } else {
      localStorage.removeItem('cos_auth')
      localStorage.removeItem('local_cosId')
      localStorage.removeItem('local_cosToken')
      localStorage.removeItem('local_user')
    }
  }, { deep: true })

  // 登录
  function login(creds: CosCredentials) {
    credentials.value = creds
  }

  // 登出
  function logout() {
    credentials.value = null
  }

  return {
    credentials,
    isLoggedIn,
    login,
    logout,
  }
})
