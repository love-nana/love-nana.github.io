<template>
  <header class="category-header">
    <div class="categories-container">
      <!-- 编辑入口按钮 -->
      <div v-if="showEdit" class="entry-edit-btn" @click="goToEdit">
        <i class="fas fa-square-pen"></i>
      </div>

      <div class="categories">
        <button
          v-for="cat in categories"
          :key="cat.key"
          :class="[
            'category-btn',
            cat.colorClass,
            { active: modelValue === cat.key }
          ]"
          @click="selectCategory(cat.key)"
        >
          <i :class="cat.icon"></i> {{ cat.label }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Category, CategoryConfig } from '@/types'

const props = defineProps<{
  modelValue: Category
  showEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Category): void
  (e: 'edit'): void
}>()

const categories: CategoryConfig[] = [
  { key: 'all', label: '全部', icon: 'fas fa-th' },
  { key: '我们', label: '我们', icon: 'fas fa-user-friends', colorClass: 'btn-color-pink' },
  { key: '日常', label: '日常', icon: 'fas fa-bookmark', colorClass: 'btn-color-green' },
  { key: '心情', label: '心情', icon: 'fas fa-face-laugh', colorClass: 'btn-color-yellow' },
  { key: '美食', label: '美食', icon: 'fas fa-utensils', colorClass: 'btn-color-orange' },
  { key: '旅行', label: '旅行', icon: 'fas fa-plane', colorClass: 'btn-color-blue' },
  { key: '心愿', label: '心愿', icon: 'fas fa-star', colorClass: 'btn-color-creme-yellow' },
]

function selectCategory(key: Category) {
  emit('update:modelValue', key)
}

function goToEdit() {
  emit('edit')
}
</script>

<style scoped>
.category-header {
  background: #fff;
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.categories-container {
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 10px;
}

.entry-edit-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.entry-edit-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.categories {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 2px;
}

.categories::-webkit-scrollbar {
  display: none;
}

.category-btn {
  flex-shrink: 0;
  padding: 8px 14px;
  border: none;
  border-radius: 20px;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.category-btn:hover {
  background: #e8e8e8;
}

.category-btn.active {
  background: #ff758c;
  color: white;
}

.btn-color-pink.active {
  background: #ff9a9e;
}

.btn-color-green.active {
  background: #a8e6cf;
  color: #333;
}

.btn-color-yellow.active {
  background: #ffd93d;
  color: #333;
}

.btn-color-orange.active {
  background: #ff8a65;
}

.btn-color-blue.active {
  background: #81d4fa;
  color: #333;
}

.btn-color-creme-yellow.active {
  background: #fff9c4;
  color: #333;
}
</style>
