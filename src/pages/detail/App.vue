<template>
  <div class="food-card">
    <div class="image-list" id="image-list">
      <img
        v-for="(imgUrl, index) in imageUrls"
        :key="index"
        class="food-image"
        :data-original-src="imgUrl"
        :data-pic-index="index"
        :src="imgUrl + '&imageMogr2/quality/30'"
        @click="openZoomInModal(index)"
      />
    </div>

    <div class="food-content">
      <div class="food-date" id="food-date">{{ displayDate }}</div>
      <h2 class="food-title" id="food-title">{{ food?.title }}</h2>
      <p class="food-description" id="food-description" v-html="formattedDesc"></p>
    </div>
  </div>

  <div
    class="zoom-in-modal"
    :class="{ active: modalActive }"
    id="imageModal"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @click="handleModalClick"
  >
    <i class="fa-solid fa-circle-xmark pic-close-btn" @click.stop="closeZoomInModal"></i>
    <img id="modalImage" :src="currentModalImg" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCos } from '@/composables/useCos'
import type { Photo } from '@/types'
import './detail.css'

const { getPhotoUrl, getPhotoUrls } = useCos()

// 从 localStorage 获取数据
const foodStr = localStorage.getItem('foodDetails')
const food = ref<Photo | null>(foodStr ? JSON.parse(foodStr) : null)

// 图片列表
const imageUrls = ref<string[]>([])
const currentIndex = ref(0)

// 模态框状态
const modalActive = ref(false)
const currentModalImg = ref('')

// 格式化日期显示
const displayDate = computed(() => {
  if (!food.value) return ''
  let date = food.value.date || ''
  if (food.value.user) {
    date = date ? `${date} / ${food.value.user}` : food.value.user
  }
  return date
})

// 格式化描述
const formattedDesc = computed(() => {
  if (!food.value?.desc) return ''
  return food.value.desc.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>')
})

// 加载图片
async function loadImages() {
  if (!food.value) return

  console.log('加载图片数据:', food.value)

  try {
    if (food.value.images && food.value.images.length > 0) {
      // 多图
      console.log('加载多图:', food.value.images)
      const urls = await getPhotoUrls(food.value.images)
      imageUrls.value = urls.filter((url): url is string => url !== null)
      console.log('多图URL:', imageUrls.value)
    } else {
      // 单图 - 优先使用 imageUrl，否则使用 image
      const imagePath = food.value.imageUrl || food.value.image
      console.log('加载单图:', imagePath)
      if (imagePath) {
        const url = await getPhotoUrl(imagePath)
        console.log('单图URL:', url)
        if (url) {
          imageUrls.value = [url]
        }
      }
    }
  } catch (err) {
    console.error('加载图片失败:', err)
  }
}

// 打开缩放模态框
function openZoomInModal(index: number) {
  currentIndex.value = index
  currentModalImg.value = imageUrls.value[index]
  modalActive.value = true
  document.body.style.overflow = 'hidden'
}

// 关闭缩放模态框
function closeZoomInModal() {
  modalActive.value = false
  document.body.style.overflow = 'auto'
  currentModalImg.value = ''
}

// 点击模态框背景处理
function handleModalClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.classList.contains('zoom-in-modal')) {
    closeZoomInModal()
  }
}

// 触摸事件处理
let startX = 0
let startY = 0
let endX = 0
let endY = 0
let singleFinger = false
const clickThreshold = 50
let startTime = 0

function handleTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  singleFinger = e.touches.length === 1
  startTime = new Date().getTime()
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length === 1) {
    e.preventDefault()
    singleFinger = true
  } else {
    singleFinger = false
  }
}

function handleTouchEnd(e: TouchEvent) {
  // 如果模态框未打开，不处理
  if (!modalActive.value) return

  let endTime = new Date().getTime()
  if (endTime - startTime > 300) {
    return
  }

  if (!singleFinger) {
    return
  }

  // 放大情况下，不允许切换图片
  let curScaleVal = (window as any).visualViewport?.scale
  if (curScaleVal > 1) {
    return
  }

  endX = e.changedTouches[0].clientX
  endY = e.changedTouches[0].clientY

  const diffX = Math.abs(startX - endX)
  const diffY = Math.abs(startY - endY)
  const maxDiff = Math.max(diffX, diffY)

  const modalImg = document.getElementById('modalImage')
  if (!modalImg) return

  if (maxDiff < clickThreshold) {
    // 检查点击位置
    const imageRect = modalImg.getBoundingClientRect()
    const clickX = (startX + endX) / 2
    const clickY = (startY + endY) / 2
    if (clickX < imageRect.left || clickX > imageRect.right ||
        clickY < imageRect.top || clickY > imageRect.bottom) {
      e.preventDefault()
      closeZoomInModal()
    }
  } else {
    if (diffX > diffY) {
      if (startX > endX) {
        e.preventDefault()
        nextImage()
      } else {
        e.preventDefault()
        prevImage()
      }
    } else {
      if (startY > endY) {
        e.preventDefault()
        nextImage()
      } else {
        e.preventDefault()
        prevImage()
      }
    }
  }
}

// 切换图片
function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % imageUrls.value.length
  currentModalImg.value = imageUrls.value[currentIndex.value]
}

function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + imageUrls.value.length) % imageUrls.value.length
  currentModalImg.value = imageUrls.value[currentIndex.value]
}

// 键盘事件
function handleKeydown(e: KeyboardEvent) {
  if (!modalActive.value) return

  if (e.key === 'Escape') {
    closeZoomInModal()
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.key === 'ArrowUp' ? prevImage() : nextImage()
  }
}

onMounted(() => {
  loadImages()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
