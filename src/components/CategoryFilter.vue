<template>
  <header class="category-header">
    <div class="categories-container">
      <!-- 编辑入口按钮 -->
      <div v-if="showEdit" class="entry-edit-btn" @click="goToEdit">
        <i class="fas fa-pen-to-square"></i>
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
  { key: 'all', label: '全部', icon: 'fas fa-border-all' },
  { key: '我们', label: '我们', icon: 'fas fa-heart', colorClass: 'btn-color-rose' },
  { key: '日常', label: '日常', icon: 'fas fa-bookmark', colorClass: 'btn-color-mint' },
  { key: '心情', label: '心情', icon: 'fas fa-face-smile', colorClass: 'btn-color-gold' },
  { key: '美食', label: '美食', icon: 'fas fa-utensils', colorClass: 'btn-color-peach' },
  { key: '旅行', label: '旅行', icon: 'fas fa-plane', colorClass: 'btn-color-sky' },
  { key: '心愿', label: '心愿', icon: 'fas fa-star', colorClass: 'btn-color-cream' },
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
  background: rgba(250, 245, 239, 0.95);
  padding: 12px 0;
  position: sticky;
  top: 8px;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(139, 69, 87, 0.08);
  border-bottom: 1px solid rgba(201, 169, 110, 0.2);
  margin: 0 8px;
  border-radius: 0 0 12px 12px;
}

.categories-container {
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 10px;
  max-width: 1200px;
  margin: 0 auto;
}

.entry-edit-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B4557, #A65D6A);
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(139, 69, 87, 0.2);
}

.entry-edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 69, 87, 0.3);
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
  padding: 8px 16px;
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.8);
  color: #8B4557;
  font-size: 13px;
  font-family: Georgia, serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-btn:hover {
  background: rgba(201, 169, 110, 0.15);
  border-color: rgba(201, 169, 110, 0.5);
}

.category-btn.active {
  background: linear-gradient(135deg, #8B4557, #A65D6A);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 3px 10px rgba(139, 69, 87, 0.25);
}

.category-btn.active i {
  color: #fff;
}

.category-btn i {
  font-size: 12px;
  color: #C9A96E;
}

/* 分类颜色变体 */
.btn-color-rose.active {
  background: linear-gradient(135deg, #D4A5A5, #C9A96E);
}

.btn-color-mint.active {
  background: linear-gradient(135deg, #A65D6A, #8B4557);
}

.btn-color-gold.active {
  background: linear-gradient(135deg, #C9A96E, #A65D6A);
}

.btn-color-peach.active {
  background: linear-gradient(135deg, #A65D6A, #D4A5A5);
}

.btn-color-sky.active {
  background: linear-gradient(135deg, #8B4557, #A65D6A);
}

.btn-color-cream.active {
  background: linear-gradient(135deg, #D4A5A5, #A65D6A);
}
</style>
