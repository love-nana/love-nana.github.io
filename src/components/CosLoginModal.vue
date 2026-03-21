<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>权限信息</h2>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="cosId">ID</label>
            <input
              id="cosId"
              v-model="form.cosId"
              type="text"
              placeholder="请输入ID"
              required
            />
            <span v-if="errors.cosId" class="error-message">{{ errors.cosId }}</span>
          </div>

          <div class="form-group">
            <label for="cosToken">密钥</label>
            <input
              id="cosToken"
              v-model="form.cosToken"
              type="password"
              placeholder="请输入您的密钥"
              required
            />
            <span v-if="errors.cosToken" class="error-message">{{ errors.cosToken }}</span>
          </div>

          <div class="form-group">
            <label for="user">用户</label>
            <select id="user" v-model="form.user">
              <option value="娜宝">娜宝</option>
              <option value="温宝">温宝</option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="close">取消</button>
            <button type="submit" class="btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { CosCredentials } from '@/types'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const authStore = useAuthStore()

const form = reactive({
  cosId: '',
  cosToken: '',
  user: '娜宝',
})

const errors = reactive({
  cosId: '',
  cosToken: '',
})

function validate(): boolean {
  errors.cosId = form.cosId ? '' : 'ID不能为空'
  errors.cosToken = form.cosToken ? '' : '密钥不能为空'
  return !errors.cosId && !errors.cosToken
}

function handleSubmit() {
  if (!validate()) return

  const creds: CosCredentials = {
    secretId: form.cosId,
    secretKey: form.cosToken,
    user: form.user,
  }

  authStore.login(creds)
  emit('success')
  resetForm()
}

function close() {
  emit('close')
  resetForm()
}

function resetForm() {
  form.cosId = ''
  form.cosToken = ''
  form.user = '娜宝'
  errors.cosId = ''
  errors.cosToken = ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus,
select:focus {
  outline: none;
  border-color: #ff758c;
}

.error-message {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #f44336;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

button {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

.btn-primary {
  background: linear-gradient(135deg, #ff758c, #ff9a9e);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
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
