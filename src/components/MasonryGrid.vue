<template>
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed, onUnmounted } from 'vue'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
import type { Photo } from '@/types'

const props = defineProps<{
  photos: Photo[]
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
  const gutter = 8
  const itemMargin = 8 // 4px * 2 for left+right

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
const masonryStyle = computed(() => ({
  maxWidth: `${columnConfig.value.columnWidth * columnConfig.value.cols + columnConfig.value.gutter * (columnConfig.value.cols - 1)}px`
}))

function updateContainerWidth() {
  if (container.value) {
    containerWidth.value = container.value.offsetWidth
  }
}

function initMasonry() {
  if (!container.value) return

  updateContainerWidth()

  // 等待图片加载完成后再初始化
  imagesLoaded(container.value, () => {
    if (!container.value) return

    // 强制更新容器宽度
    containerWidth.value = container.value.offsetWidth

    msnry = new Masonry(container.value, {
      itemSelector: '.item',
      columnWidth: columnConfig.value.columnWidth,
      gutter: columnConfig.value.gutter,
      percentPosition: true,
      transitionDuration: '0.4s',
      stamp: '.masonry-stamp',
    })
  })
}

function reloadMasonry() {
  if (!container.value) return

  imagesLoaded(container.value, () => {
    if (!container.value || !msnry) return

    msnry.reloadItems()
    msnry.layout()
  })
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
  await nextTick()
  setTimeout(reloadMasonry, 150)
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
  margin: 4px;
  opacity: 1;
  border: 1px solid rgba(201, 169, 110, 0.15);
  /* 不要改 */
  width: calc((100% - 30px) / 4);
}

.item:hover {
  transform: translateY(-6px) rotate(-0.5deg);
  box-shadow:
    0 8px 16px rgba(0,0,0,0.1),
    0 16px 32px rgba(139, 69, 87, 0.12);
  border-color: rgba(201, 169, 110, 0.4);
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
  padding: 0.6rem 0.5rem;
}

.food-country {
  position: absolute;
  right: 0.4rem;
  top: -1.4rem;
  z-index: 99;
  color: #8B4557;
  display: inline-block;
  background: rgba(250, 245, 239, 0.95);
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  font-size: 0.6rem;
  font-family: Georgia, serif;
  border: 1px dashed #C9A96E;
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
    width: calc((100% - 24px) / 3);
  }
}

@media (max-width: 600px) {
  .item {
    /* 不要改 */
    width: calc((100% - 15px) / 2);
  }
}
</style>
