<template>
  <div ref="container" class="masonry">
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
import { ref, watch, onMounted, nextTick } from 'vue'
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
const isLayouting = ref(false)
let msnry: Masonry | null = null

function getColumnConfig() {
  const scrollbarWidth = 17
  const containerWidth = window.innerWidth - scrollbarWidth

  const width = window.innerWidth
  let columns = 4
  if (width < 768) columns = 2
  else if (width < 1200) columns = 3

  const gutter = 6
  const columnWidth = (containerWidth - gutter * (columns - 1)) / columns

  return { columnWidth, gutter }
}

function initMasonry() {
  if (!container.value) return

  const { columnWidth, gutter } = getColumnConfig()

  imagesLoaded(container.value, () => {
    msnry = new Masonry(container.value!, {
      itemSelector: '.item',
      columnWidth: columnWidth,
      gutter: gutter,
      percentPosition: false,
      transitionDuration: '0.4s',
      stamp: '.masonry-stamp',
    })

    isLayouting.value = false
  })
}

function reloadMasonry() {
  if (!container.value || !msnry) return

  const { columnWidth, gutter } = getColumnConfig()

  isLayouting.value = true

  // 重新计算列宽（使用 any 类型）
  ;(msnry as any).options.columnWidth = columnWidth
  ;(msnry as any).options.gutter = gutter

  imagesLoaded(container.value, () => {
    msnry!.reloadItems()

    // 渐变过渡
    const items = container.value!.querySelectorAll('.item')
    items.forEach((item: Element) => {
      const el = item as HTMLElement
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      el.style.transition = 'opacity 0.3s, transform 0.3s'
    })

    msnry!.layout()

    // 渐显
    setTimeout(() => {
      items.forEach((item: Element) => {
        const el = item as HTMLElement
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
      isLayouting.value = false
    }, 50)
  })
}

onMounted(() => {
  initMasonry()

  // 窗口大小变化时重新初始化
  let resizeTimer: number | null = null
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      if (msnry) {
        msnry.destroy()
        msnry = null
      }
      initMasonry()
    }, 200)
  })
})

// 监听照片变化
watch(() => props.photos, async () => {
  await nextTick()
  setTimeout(reloadMasonry, 100)
}, { deep: true })
</script>

<style scoped>
.masonry {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  margin-top: 0.5rem;
  padding-right: 6px;
  overflow-x: hidden;
}

.item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease, opacity 0.3s, transform 0.3s;
  position: relative;
  width: calc(50% - 15px);
  box-sizing: border-box;
  margin: 3px;
  opacity: 1;
}

.item:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 30px rgba(0, 0, 0, 0.15);
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
  color: #333333;
  background: rgba(245, 233, 217, 0.5);
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.6rem;
  z-index: 10;
}

.food-content {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0.5rem;
}

.food-country {
  position: absolute;
  right: 0.3rem;
  top: -1.3rem;
  z-index: 99;
  color: #333333;
  display: inline-block;
  background: rgba(245, 233, 217, 0.5);
  padding: 0.2rem 0.3rem;
  border-radius: 10px;
  font-size: 0.6rem;
}

.food-title {
  padding: 0.2rem 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 5px;
  color: #8b4513;
  line-height: 1.1;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式 - 根据视口宽度固定列宽 */
@media (min-width: 1200px) {
  .item {
    width: calc(25% - 15px);
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .item {
    width: calc(33% - 15px);
  }
}
</style>
