<template>
  <div class="masonry-wrapper">
    <MasonryGrid
      :columns="{ default: 4, 900: 3, 600: 2 }"
      :gutter="8"
      class="masonry"
    >
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="item masonry-grid-item"
        @click="$emit('select', photo)"
      >
        <!-- 多图标记 -->
        <div v-if="photo.images && photo.images.length > 1" class="pic-num">
          P{{ photo.images.length }}
        </div>

        <!-- 图片 -->
        <img
          v-if="photo.imageUrl"
          :src="`${photo.imageUrl}&imageMogr2/quality/30`"
          :alt="photo.title"
          class="food-image"
          loading="lazy"
        />

        <!-- 内容区 -->
        <div class="food-content">
          <span v-if="photo.date" class="food-country">{{ photo.date }}</span>
          <h3 v-if="photo.title" class="food-title">{{ photo.title }}</h3>
        </div>
      </div>
    </MasonryGrid>

    <!-- 加载遮罩 -->
    <Transition name="fade">
      <div v-if="isReloading || isReloadingFilter || !isLayoutReady" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { MasonryGrid } from 'vue3-masonry-css'
import type { Photo } from '@/types'

const props = defineProps<{
  photos: Photo[]
  isReloading?: boolean
  reloadKey?: number
}>()

defineEmits<{
  (e: 'select', photo: Photo): void
}>()

const isLayoutReady = ref(false)
const isReloadingFilter = ref(false)

onMounted(() => {
  nextTick(() => {
    isLayoutReady.value = true
  })
})

watch(() => props.photos, async () => {
  if (isLayoutReady.value) {
    isReloadingFilter.value = true
  }
  await nextTick()
  setTimeout(() => {
    isReloadingFilter.value = false
  }, 500)
}, { deep: true })

watch(() => props.reloadKey, () => {
  if (isLayoutReady.value) {
    isReloadingFilter.value = true
  }
  nextTick(() => {
    setTimeout(() => {
      isReloadingFilter.value = false
    }, 500)
  })
})

watch(() => props.isReloading, (newVal) => {
  if (newVal) {
    isReloadingFilter.value = true
  } else {
    isReloadingFilter.value = false
  }
})
</script>

<style scoped>
.masonry-wrapper {
  position: relative;
  padding-top: 10px;
}

.masonry {
  width: 100%;
  margin: 0 auto;
}

.item {
  background: #FAFAFA;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    0 2px 4px rgba(0,0,0,0.06),
    0 4px 12px rgba(0,0,0,0.06);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  box-sizing: border-box;
  min-height: 200px;
  opacity: 1;
}

.item:hover {
  transform: translateY(-6px) rotate(-0.5deg);
  box-shadow:
    0 8px 16px rgba(0,0,0,0.1),
    0 16px 32px rgba(139, 69, 87, 0.12);
}

.food-image {
  width: 100%;
  height: auto;
  display: block;
}

.pic-num {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  color: #fff;
  background: linear-gradient(135deg, #8B4557, #A65D6A);
  border-radius: 50%;
  padding: 0.25rem 0.4rem;
  font-size: 0.65rem;
  z-index: 10;
  font-family: Georgia, serif;
  box-shadow: 0 2px 6px rgba(139, 69, 87, 0.3);
}

.food-content {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0.4rem 0.4rem 0.3rem;
}

.food-country {
  position: absolute;
  right: 0.4rem;
  top: -1.7rem;
  z-index: 99;
  color: #8B4557;
  display: inline-block;
  background: rgba(250, 245, 239, 0.9);
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  font-size: 0.55rem;
  font-family: Georgia, serif;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.food-title {
  padding: 0.15rem 0.3rem;
  font-size: 0.95rem;
  font-weight: 400;
  margin: 0;
  color: #8B4557;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Georgia, serif;
}

/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 249, 250, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 8px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(201, 169, 110, 0.2);
  border-top-color: #C9A96E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
