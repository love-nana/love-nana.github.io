<template>
  <div class="masonry-wrapper">
    <div ref="container" class="masonry" :style="masonryStyle">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="item"
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
    </div>

    <!-- 加载遮罩（仅重新加载/加载更多时显示） -->
    <Transition name="fade">
      <div v-if="isReloading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed, onUnmounted } from 'vue'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
import type { Photo } from '@/types'

const props = defineProps<{
  photos: Photo[]
  isReloading?: boolean  // 是否是重新加载（加载更多），true 时显示遮罩
}>()

defineEmits<{
  (e: 'select', photo: Photo): void
}>()

const container = ref<HTMLElement>()
const containerWidth = ref(1200)
let msnry: Masonry | null = null

// 计算列数和列宽
const columnConfig = computed(() => {
  const width = containerWidth.value
  const gutter = 4
  const itemMargin = 6 // 3px * 2 for left+right

  let cols = 4
  let columnWidth = 280

  if (width < 600) {
    cols = 2
    columnWidth = Math.floor((width - gutter - itemMargin) / 2)
  } else if (width < 900) {
    cols = 3
    columnWidth = Math.floor((width - gutter * 2 - itemMargin) / 3)
  } else {
    cols = 4
    columnWidth = Math.floor((width - gutter * 3 - itemMargin) / 4)
  }

  return { columnWidth, gutter, cols }
})

// Masonry容器的内联样式
const masonryStyle = computed(() => ({}))

function updateContainerWidth() {
  if (container.value) {
    containerWidth.value = container.value.offsetWidth
  }
}

function initMasonry() {
  if (!container.value) return

  updateContainerWidth()

  // 初始化 Masonry
  const doInit = () => {
    if (!container.value || msnry) return

    containerWidth.value = container.value.offsetWidth

    msnry = new Masonry(container.value, {
      itemSelector: '.item',
      columnWidth: columnConfig.value.columnWidth,
      gutter: columnConfig.value.gutter,
      percentPosition: true,
      transitionDuration: '0.4s',
      stamp: '.masonry-stamp',
    })
  }

  // 图片加载完成后初始化
  imagesLoaded(container.value, () => {
    doInit()
  })

  // fallback：500ms 后无论图片加载状态如何都初始化（处理图片已缓存的情况）
  setTimeout(() => {
    doInit()
  }, 500)
}

function reloadMasonry() {
  if (!container.value || !msnry) return

  // 禁用 Masonry 动画
  ;(msnry as any).options.transitionDuration = 0

  const doLayout = () => {
    if (!container.value || !msnry) return
    msnry.reloadItems()
    msnry.layout()
    // 布局完成后恢复 Masonry 动画
    ;(msnry as any).options.transitionDuration = 400
  }

  imagesLoaded(container.value, () => {
    doLayout()
  })

  // fallback：500ms 后无论图片加载状态如何都执行布局
  setTimeout(() => {
    doLayout()
  }, 500)
}

let resizeTimer: number | null = null

onMounted(() => {
  initMasonry()

  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      updateContainerWidth()
      if (msnry) {
        msnry.destroy()
        msnry = null
      }
      initMasonry()
    }, 250)
  })
})

onUnmounted(() => {
  if (msnry) {
    msnry.destroy()
    msnry = null
  }
})

watch(() => props.photos, async () => {
  // 等待 DOM 更新
  await nextTick()

  // 短暂延迟确保 DOM 已更新
  requestAnimationFrame(() => {
    reloadMasonry()
  })
}, { deep: true })
</script>

<style scoped>
.masonry {
  width: 100%;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
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
  margin: 2px;
  opacity: 1;
  /* 不要改 */
  width: calc((100% - 30px) / 4);
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

/* 响应式调整 */
@media (max-width: 900px) {
  .item {
    /* 不要改 */
    width: calc((100% - 25px) / 3);
  }
}

@media (max-width: 600px) {
  .item {
    /* 不要改 */
    width: calc((100% - 16px) / 2);
  }
}

/* 加载遮罩 */
.masonry-wrapper {
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 249, 250, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
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
