<template>
  <div class="gallery-page">
    <!-- 分类筛选 -->
    <CategoryFilter
      v-model="galleryStore.currentCategory"
      show-edit
      @edit="goToEdit"
    />

    <!-- 照片网格 -->
    <div v-if="galleryStore.displayedPhotos.length > 0" class="gallery-content">
      <MasonryGrid
        :photos="galleryStore.displayedPhotos"
        :is-reloading="isReloading"
        @select="showDetail"
      />
    </div>

    <!-- 空状态 -->
    <div v-else-if="!galleryStore.loading" class="empty-state">
      <p>暂无照片</p>
    </div>

    <!-- 无限滚动加载指示器 -->
    <div v-if="galleryStore.canLoadMore" class="load-more-trigger">
      <div v-if="isLoadingMore" class="spinner"></div>
      <span v-if="isLoadingMore">正在加载...</span>
    </div>

    <!-- 全部加载完毕 -->
    <div v-if="!galleryStore.canLoadMore && galleryStore.displayedPhotos.length > 0" class="end-message">
      没有更多了
    </div>

    <!-- 登录弹窗 -->
    <CosLoginModal
      :show="showLogin"
      @close="showLogin = false"
      @success="onLoginSuccess"
    />

    <!-- 全局组件 -->
    <LoadingOverlay />
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import MasonryGrid from '@/components/MasonryGrid.vue'
import CosLoginModal from '@/components/CosLoginModal.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
import { useAuthStore } from '@/stores/auth'
import { useGalleryStore } from '@/stores/gallery'
import { useUiStore } from '@/stores/ui'
import { useCos } from '@/composables/useCos'
import type { Photo } from '@/types'

const authStore = useAuthStore()
const galleryStore = useGalleryStore()
const uiStore = useUiStore()
const { loadPhotos, getPhotoUrls } = useCos()

const showLogin = ref(false)
const isLoadingMore = ref(false)
const isReloading = ref(false)
let scrollHandler: (() => void) | null = null

// 加载照片
async function fetchPhotos() {
  if (!authStore.isLoggedIn) {
    showLogin.value = true
    return
  }

  uiStore.showLoading('正在加载...')

  try {
    const data = await loadPhotos()
    if (data?.list) {
      // 为每张照片生成 ID 和 URL
      const photos: Photo[] = data.list.map((item: Photo) => ({
        ...item,
        id: item.image,
      }))

      // 批量获取图片 URL
      const imagePaths = photos.map(p => p.image)
      const urls = await getPhotoUrls(imagePaths)

      photos.forEach((photo, index) => {
        photo.imageUrl = urls[index] || ''
      })

      galleryStore.setPhotos(photos)
    }
  } catch (err) {
    uiStore.showNotification('error', '错误', '加载照片失败')
    console.error(err)
  } finally {
    uiStore.hideLoading()
  }
}

// 加载更多
async function loadMore() {
  if (isLoadingMore.value || !galleryStore.canLoadMore) return

  isLoadingMore.value = true
  isReloading.value = true
  galleryStore.loadMore()

  // 模拟短暂延迟以显示加载动画
  setTimeout(() => {
    isLoadingMore.value = false
    isReloading.value = false
  }, 300)
}

// 滚动处理：滚动到 50% 时加载更多
function handleScroll() {
  const scrollTop = window.scrollY
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = window.innerHeight
  const scrollPercent = scrollTop / (scrollHeight - clientHeight)

  if (scrollPercent >= 0.5 && galleryStore.canLoadMore && !isLoadingMore.value) {
    loadMore()
  }
}

// 查看详情
function showDetail(photo: Photo) {
  localStorage.setItem('foodDetails', JSON.stringify(photo))
  window.open('./detail.html', '_blank')
}

// 去编辑页
function goToEdit() {
  if (!authStore.isLoggedIn) {
    showLogin.value = true
    return
  }
  window.location.href = './gallery-edit.html'
}

// 登录成功
function onLoginSuccess() {
  showLogin.value = false
  fetchPhotos()
}

onMounted(() => {
  fetchPhotos()
  scrollHandler = handleScroll
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
  scrollbar-gutter: stable;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f8f9fa;
  color: #333;
}

.gallery-page {
  min-height: 100vh;
}

.gallery-content {
  padding-top: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.load-more-trigger {
  text-align: center;
  padding: 20px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #ff758c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.end-message {
  text-align: center;
  padding: 20px;
  color: #ccc;
  font-size: 14px;
}
</style>
