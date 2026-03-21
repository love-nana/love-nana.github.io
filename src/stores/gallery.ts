import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Category, Photo } from '@/types'

export const useGalleryStore = defineStore('gallery', () => {
  // 状态
  const photos = ref<Photo[]>([])
  const currentCategory = ref<Category>('all')
  const loading = ref(false)
  const loadedCount = ref(0)  // 已加载数量（用于分页）
  const perPage = 20          // 每页数量
  const hasMore = ref(true)   // 是否还有更多

  // 分类筛选后的照片
  const filteredPhotos = computed(() => {
    if (currentCategory.value === 'all') {
      return photos.value
    }
    return photos.value.filter(p => p.category === currentCategory.value)
  })

  // 当前显示的照片（分页）
  const displayedPhotos = computed(() => {
    return filteredPhotos.value.slice(0, loadedCount.value)
  })

  // 是否可以加载更多
  const canLoadMore = computed(() => {
    return loadedCount.value < filteredPhotos.value.length
  })

  // 设置照片列表
  function setPhotos(newPhotos: Photo[]) {
    photos.value = newPhotos
    loadedCount.value = Math.min(perPage, newPhotos.length)
    hasMore.value = newPhotos.length > perPage
  }

  // 设置当前分类
  function setCategory(category: Category) {
    currentCategory.value = category
    loadedCount.value = Math.min(perPage, filteredPhotos.value.length)
  }

  // 加载更多
  function loadMore() {
    const nextCount = loadedCount.value + perPage
    loadedCount.value = Math.min(nextCount, filteredPhotos.value.length)
    hasMore.value = loadedCount.value < filteredPhotos.value.length
  }

  // 添加照片
  function addPhoto(photo: Photo) {
    photos.value.unshift(photo)
    loadedCount.value = Math.min(loadedCount.value + 1, filteredPhotos.value.length)
  }

  // 删除照片
  function removePhoto(id: string) {
    const index = photos.value.findIndex(p => p.id === id)
    if (index > -1) {
      photos.value.splice(index, 1)
      loadedCount.value = Math.min(loadedCount.value, filteredPhotos.value.length)
    }
  }

  // 更新照片
  function updatePhoto(id: string, data: Partial<Photo>) {
    const photo = photos.value.find(p => p.id === id)
    if (photo) {
      Object.assign(photo, data)
    }
  }

  return {
    photos,
    currentCategory,
    loading,
    loadedCount,
    hasMore,
    filteredPhotos,
    displayedPhotos,
    canLoadMore,
    setPhotos,
    setCategory,
    loadMore,
    addPhoto,
    removePhoto,
    updatePhoto,
  }
})
