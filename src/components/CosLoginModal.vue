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
  background: rgba(44, 44, 44, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 20px;
}

.modal-content {
  background: #FAF5EF;
  border-radius: 12px;
  width: 100%;
  max-width: 380px;
  overflow: hidden;
  box-shadow:
    0 10px 30px rgba(0,0,0,0.2),
    0 0 0 1px rgba(201, 169, 110, 0.3);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px dashed #C9A96E;
  text-align: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #8B4557;
  font-family: Georgia, serif;
  letter-spacing: 2px;
}

form {
  padding: 24px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #8B4557;
  font-family: Georgia, serif;
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
  font-family: Georgia, serif;
}

input:focus,
select:focus {
  outline: none;
  border-color: #8B4557;
  box-shadow: 0 0 0 3px rgba(139, 69, 87, 0.15);
}

.error-message {
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #c0392b;
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
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: Georgia, serif;
}

.btn-secondary {
  background: #F0E4D7;
  color: #8B4557;
  border: 1px solid rgba(201, 169, 110, 0.3);
}

.btn-secondary:hover {
  background: #E5D4B3;
}

.btn-primary {
  background: linear-gradient(135deg, #8B4557, #A65D6A);
  color: white;
  box-shadow: 0 3px 10px rgba(139, 69, 87, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 87, 0.35);
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
