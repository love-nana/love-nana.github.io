<template>
<div class="container">
    <!-- 构建时间角标 -->
    <div class="build-time-badge" title="代码构建时间">&#x23F0; {{ buildTime }}</div>
    <!-- 调试角标 -->
    <div class="debug-badge" v-if="debugInfo">{{ debugInfo }}</div>
    <div class="header-bg" id="header-bg" @click="goToGallery"></div>
    <div class="actions">
        <button class="fit-btn btn-secondary" id="addImageBtn" @click="imageUpload.triggerFileInput">
            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            添加我们的故事
        </button>
        <input type="file" id="fileInput" class="file-input" accept="image/jpeg,image/png,image/gif" multiple @change="imageUpload.handleFileSelect"/>
    </div>

    <div class="drop-zone" id="dropZone" :class="{ active: dragDrop.isDragging.value }" @dragover.prevent @drop.prevent="handleDrop" @dragenter="dragDrop.isDragging.value = true" @dragleave="dragDrop.isDragging.value = false">
        <p>拖拽图片到这里上传，或点击上方"添加图片"按钮</p>
    </div>

    <!-- 上传预览区域 -->
    <div class="upload-preview" id="uploadPreview" :class="{ active: imageUpload.showUploadPreview.value }">
        <h3 class="preview-title">预览上传的图片</h3>
        <div class="preview-list" id="previewList">
            <div v-for="(file, index) in imageUpload.selectedFiles.value" :key="index" class="preview-item" :data-index="index">
                <img :src="file.dataUrl" class="preview-image">
                <button class="remove-btn" @click="imageUpload.removePreviewFile(index)">×</button>
            </div>
        </div>
        <div class="upload-actions">
            <button class="btn btn-cancel" id="cancelUpload" @click="imageUpload.cancelUploadImages">取消</button>
            <button class="btn btn-secondary" id="confirmUpload" @click="confirmUploadImages">确认上传</button>
        </div>
    </div>

    <!-- 分类   -->
    <CategoryFilter v-model="currentCategoryFilter" :fixed="false" />

    <div class="gallery" id="imageGallery">
        <div v-if="images.length === 0" class="empty-state">
            <h3>还没有图片</h3>
            <p>点击"添加图片"按钮上传您的第一张图片</p>
        </div>
        <div v-for="(image, idx) in displayedImages" :key="image.id || idx"
             class="image-card" :data-index="getOriginalIndex(image)" draggable="true"
             @dragstart="dragDrop.handleDragStart($event, image, idx)"
             @dragend="dragDrop.handleDragEnd"
             @dragover="dragDrop.handleDragOver"
             @dragenter="dragDrop.handleDragEnter"
             @dragleave="dragDrop.handleDragLeave"
             @drop="dragDrop.handleCardDrop($event, image, idx)"
             @click.stop="showDetail(image)">
            <div class="image-container" @click.stop="showDetail(image)">
                <img :src="image.imageUrl" :alt="image.title" class="img-style" @error="handleImageError">
                <div v-if="image.images && image.images.length > 1" class="pic-num">P{{ image.images.length }}</div>
            </div>
            <div class="image-info">
                <p class="image-date single-line-ellipsis">{{ image.date || '' }}</p>
                <h3 class="image-title single-line-ellipsis">{{ image.title || '无标题' }}</h3>
                <p class="image-description single-line-ellipsis">{{ image.desc || '' }}</p>
            </div>
            <div class="image-actions">
                <button class="action-btn edit-btn" @click.stop="openEditModal(getOriginalIndex(image))">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                    编辑
                </button>
                <button class="action-btn delete-btn" @click.stop="deleteImage(getOriginalIndex(image))">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    删除
                </button>
            </div>
        </div>
    </div>

    <!-- 加载指示器 -->
    <div id="loadingIndicator" class="load-more-loading" :class="{ active: loading }">
        <div class="load-more-spinner"></div>
        正在加载更多内容...
    </div>

    <!-- 结束消息 -->
    <div id="endMessage" class="load-more-end-message" :style="{ display: canLoadMore ? 'none' : 'block' }">
        没有更多内容了
    </div>

    <!-- 编辑图片信息的模态框 -->
    <div class="modal" id="editModal" :class="{ active: editModal.showEditModal.value }">
        <div class="modal-content" id="modalContent">
            <div class="modal-header">
                <h3 class="modal-title">编辑图片信息</h3>
                <i class="fa-solid fa-circle-xmark close-edit-btn" @click="editModal.closeEditModal"></i>
            </div>
            <div class="btn-append-container">
                <button type="button" class="btn-append-pic" id="appendPicBtn" @click="editModal.triggerAppendInput">添加图片</button>
                <input type="file" id="appendFileInput" class="file-input" accept="image/*" multiple @change="editModal.handleAppendFileSelect"/>
            </div>
            <!-- 上传预览区域 -->
            <div class="edit-preview" id="editPreview" :class="{ active: editModal.editImages.value.length > 0 }">
                <div class="preview-list" id="editPreviewList">
                    <div v-for="(img, idx) in editModal.editImages.value" :key="idx" class="preview-item" :data-index="idx" draggable="true"
                         @dragstart="editModal.handlePreviewDragStart($event, idx)"
                         @dragend="editModal.handlePreviewDragEnd"
                         @dragover="dragDrop.handleDragOver"
                         @dragenter="editModal.handlePreviewDragEnter"
                         @dragleave="dragDrop.handleDragLeave"
                         @drop="editModal.handlePreviewDrop($event, idx)">
                        <img :src="img.url" @error="handleImageError">
                        <button class="remove-btn" @click="editModal.removeEditImage(idx)">×</button>
                    </div>
                </div>
            </div>
            <form id="imageForm" @submit.prevent="handleSubmitEdit">
                <input type="hidden" id="editIndex">
                <div class="form-group">
                    <label for="imageTitle">图片标题</label>
                    <input type="text" class="form-control" id="imageTitle" v-model="editModal.editForm.title" placeholder="输入图片标题">
                </div>
                <div class="form-group">
                    <label for="imageDate">图片日期</label>
                    <input type="text" id="imageDate" class="form-control" v-model="editModal.editForm.date" placeholder="点击选择日期" readonly>
                </div>

                <div class="form-group">
                    <label for="imageCategory">分类</label>
                    <select id="imageCategory" class="form-control" v-model="editModal.editForm.category">
                        <option value="我们">我们</option>
                        <option value="日常">日常</option>
                        <option value="心情">心情</option>
                        <option value="美食">美食</option>
                        <option value="旅行">旅行</option>
                        <option value="心愿">心愿</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="imageDescription">图片描述</label>
                    <div class="resize-area">
                        <div class="resizable-textarea">
                            <textarea id="imageDescription" rows="8" v-model="editModal.editForm.desc" placeholder="输入图片描述" ref="descriptionTextarea"></textarea>
                            <div class="resize-handle" id="resize-handle" @mousedown="initResize" @touchstart="initResize"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-cancel" id="cancelEdit" @click="editModal.closeEditModal">取消</button>
                    <button type="submit" class="btn btn-secondary" id="submitEdit">确定</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Loading遮罩层 -->
<div class="loading-overlay" id="loadingOverlay" :class="{ active: showLoading }">
    <div class="loading-content">
        <div class="loading-spinner">
            <div class="spinner-circle"></div>
        </div>
        <div class="loading-text">加载中，请稍候...</div>
    </div>
</div>

<!-- 登录信息弹窗 -->
<CosLoginModal
    :show="showLoginModal"
    @close="closeLoginModal"
    @success="onLoginSuccess"
/>

<!-- 通知组件 -->
<NotificationContainer />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useCos } from '@/composables/useCos'
import { useDragDrop } from '@/composables/useDragDrop'
import { useImageUpload } from '@/composables/useImageUpload'
import { useEditModal } from '@/composables/useEditModal'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import CategoryFilter from '@/components/CategoryFilter.vue'
import CosLoginModal from '@/components/CosLoginModal.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
import type { Category } from '@/types'

// Stores
const uiStore = useUiStore()
const authStore = useAuthStore()

// 构建时间（由 Vite 注入）
declare const __BUILD_TIME__: string
const buildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'dev'

// 调试信息
const debugInfo = ref('')

// COS
const { getPhotoUrl, getPhotoUrls, uploadPhotos, uploadJson, loadJson } = useCos()

// 状态
const images = ref<any[]>([])
const loading = ref(false)
const showLoading = ref(false)
const showLoginModal = ref(false)
const currentCategoryFilter = ref<Category>('all')

// 分页
const perPage = 20
const loadedCount = ref(perPage)
const isLoadingMore = ref(false)
let scrollHandler: (() => void) | null = null

// Composables
const imageUpload = useImageUpload()
const dragDrop = useDragDrop(images, handleReorder)
const editModal = useEditModal(images, handleSaveEdit)

// 计算属性
const filteredImages = computed(() => {
  if (currentCategoryFilter.value === 'all') {
    return images.value
  }
  return images.value.filter(img => img.category === currentCategoryFilter.value)
})

const displayedImages = ref<any[]>([])

const canLoadMore = computed(() => loadedCount.value < filteredImages.value.length)

// 监听分类变化，重置已加载数量
watch(currentCategoryFilter, () => {
  loadedCount.value = perPage
})

// 直接在每个 .image-card 元素上绑定 touch 事件（参考 gallery-edit.js）
function addImageCardMoveEvent() {
  const cards = document.querySelectorAll('.image-card')
  cards.forEach(card => {
    card.addEventListener('touchstart', (e) => {
      debugInfo.value = 'touchstart'
      dragDrop.handleTouchStart(e as TouchEvent)
    }, { passive: false })
    card.addEventListener('touchmove', (e) => {
      debugInfo.value = 'touchmove: drag=' + !!dragDrop.draggedElement.value
      dragDrop.handleTouchMove(e as TouchEvent)
    }, { passive: false })
    card.addEventListener('touchend', (e) => {
      debugInfo.value = 'touchend'
      dragDrop.handleTouchEnd(e as TouchEvent)
      setTimeout(() => { debugInfo.value = '' }, 1000)
    })
    card.addEventListener('touchcancel', (e) => {
      debugInfo.value = 'touchcancel'
      dragDrop.handleTouchEnd(e as TouchEvent)
    })
  })
}

// 编辑弹窗内预览图片的 touch 事件绑定
function addPreviewItemMoveEvent() {
  const previewItems = document.querySelectorAll('#editPreviewList .preview-item')
  previewItems.forEach(item => {
    item.addEventListener('touchstart', (e) => {
      debugInfo.value = 'preview-touchstart'
      editModal.handleAppendPicTouchStart(e as TouchEvent)
    }, { passive: false })
    item.addEventListener('touchmove', (e) => {
      debugInfo.value = 'preview-touchmove'
      editModal.handleAppendPicTouchMove(e as TouchEvent)
    }, { passive: false })
    item.addEventListener('touchend', (e) => {
      debugInfo.value = 'preview-touchend'
      editModal.handleAppendPicTouchEnd(e as TouchEvent)
      setTimeout(() => { debugInfo.value = '' }, 1000)
    })
    item.addEventListener('touchcancel', (e) => {
      debugInfo.value = 'preview-touchcancel'
      editModal.handleAppendPicTouchEnd(e as TouchEvent)
    })
  })
}

// 监听 displayedImages 变化，DOM 更新后绑定 touch 事件
watch(
  displayedImages,
  async () => {
    await nextTick()
    addImageCardMoveEvent()
  },
  { immediate: true }
)

// 监听 filteredImages 和 loadedCount 变化，更新 displayedImages
watch(
  [() => images.value, loadedCount],
  () => {
    displayedImages.value = filteredImages.value.slice(0, loadedCount.value)
  },
  { immediate: true, deep: true }
)

// 加载更多
function loadMore() {
  if (!canLoadMore.value || isLoadingMore.value) return
  isLoadingMore.value = true
  loadedCount.value = Math.min(loadedCount.value + perPage, filteredImages.value.length)
  setTimeout(() => {
    isLoadingMore.value = false
  }, 300)
}

// 滚动处理（带防抖）
let scrollTimer: number | null = null
function handleScroll() {
  if (scrollTimer) return
  scrollTimer = window.setTimeout(() => {
    scrollTimer = null
    const scrollTop = window.scrollY
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    const scrollPercent = scrollTop / (scrollHeight - clientHeight)
    if (scrollPercent >= 0.5 && canLoadMore.value && !isLoadingMore.value) {
      loadMore()
    }
  }, 100)
}

// 初始化
onMounted(() => {
  initResize()
  loadHeaderBg()
  initDatePicker()

  if (authStore.isLoggedIn) {
    loadPhotos()
  } else {
    setTimeout(() => {
      showLoginModal.value = true
    }, 500)
  }

  scrollHandler = handleScroll
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
  if (datePicker) {
    datePicker.destroy()
  }
})

// Pikaday 日期选择器
let datePicker: any = null

function parseDate(date: Date) {
  // 获取年月日
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1); // 月份从0开始，需要+1
  const day = String(date.getDate());
  // 格式化为 YYYY-MM-DD
  const dateString = `${year}.${month}.${day}`;
  return dateString;
}


function initDatePicker() {
  const dateInput = document.getElementById('imageDate')
  if (!dateInput || !(window as any).Pikaday) return

  datePicker = new (window as any).Pikaday({
    field: dateInput,
    format: 'YYYY-MM-DD',
    i18n: {
      previousMonth: '上一月',
      nextMonth: '下一月',
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
    },
    onSelect: function (vDate: Date) {
      // 当选择日期时更新显示
      ;(dateInput as HTMLInputElement).value = parseDate(vDate);
    }
  })
}

function initResize() {
  const handle = document.getElementById('resize-handle')
  const textarea = document.getElementById('imageDescription') as HTMLTextAreaElement
  if (!handle || !textarea) return

  let isResizing = false
  let startY = 0
  let startHeight = 0

  const onStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    isResizing = true
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    startY = clientY
    startHeight = parseInt(getComputedStyle(textarea).height, 10)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('touchmove', onMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchend', onEnd)
  }

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (!isResizing) return
    e.preventDefault()
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const deltaY = clientY - startY
    let newHeight = startHeight + deltaY
    newHeight = Math.max(100, Math.min(500, newHeight))
    textarea.style.height = newHeight + 'px'
  }

  const onEnd = () => {
    isResizing = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchend', onEnd)
  }

  handle.addEventListener('mousedown', onStart)
  handle.addEventListener('touchstart', onStart)
}

async function loadHeaderBg() {
  const url = await getPhotoUrl('assert/header-bg.jpg')
  const headerBg = document.getElementById('header-bg')
  if (headerBg && url) {
    headerBg.style.backgroundImage = `url(${url})`
  }
}

function goToGallery() {
  window.open('./gallery.html', '_blank')
}

// 文件上传
function handleDrop(e: DragEvent) {
  dragDrop.isDragging.value = false
  imageUpload.handleDrop(e)
}

async function confirmUploadImages() {
  if (imageUpload.selectedFiles.value.length === 0) {
    alert('请选择要上传的图片')
    return
  }

  showLoading.value = true
  try {
    const files = imageUpload.selectedFiles.value.map(f => f.file)
    const keys = await uploadPhotos(files)

    // 多张图片合并为一个卡片
    const imageUrls = await Promise.all(keys.map(key => getPhotoUrl(key)))
    const firstKey = keys[0]
    const firstUrl = imageUrls[0]

    const newImage = {
      id: firstKey,
      image: firstKey,
      imageUrl: firstUrl,
      title: files[0].name.replace(/\.[^.]+$/, ''),
      category: '日常',
      user: localStorage.getItem('local_user') || '娜宝',
      date: new Date().toISOString().split('T')[0],
      images: keys,
      imageUrls: imageUrls
    }

    images.value = [newImage, ...images.value]
    await saveChanges()
    imageUpload.cancelUploadImages()
    uiStore.showNotification('success', '成功', `上传了 ${keys.length} 张图片`)
  } catch (error: any) {
    uiStore.showNotification('error', '失败', error.message || '上传失败')
  } finally {
    showLoading.value = false
  }
}

// 编辑模态框
async function openEditModal(index: number) {
  editModal.openEditModal(index, getPhotoUrls)
  await nextTick()
  addPreviewItemMoveEvent()
}

async function handleSubmitEdit() {
  if (editModal.editingIndex.value < 0) return
  showLoading.value = true
  try {
    await editModal.submitEdit()
    uiStore.showNotification('success', '成功', '保存成功')
  } catch (error: any) {
    uiStore.showNotification('error', '失败', error.message || '保存失败')
  } finally {
    showLoading.value = false
  }
}

async function handleSaveEdit(index: number, _form: any, editImages: any[]): Promise<void> {
  // Handle new uploaded images
  if (editModal.appendUploadFileMap.value.size > 0) {
    const uploadList: File[] = []
    const indices: number[] = []
    editModal.appendUploadFileMap.value.forEach((file, idx) => {
      uploadList.push(file)
      indices.push(idx)
    })

    const results = await uploadPhotos(uploadList)
    for (let i = 0; i < results.length; i++) {
      const imgIndex = indices[i]
      if (!images.value[index].images) images.value[index].images = []
      if (!images.value[index].imageUrls) images.value[index].imageUrls = []
      images.value[index].images[imgIndex] = results[i]
      images.value[index].imageUrls[imgIndex] = await getPhotoUrl(results[i])
    }
    images.value[index].image = images.value[index].images[0]
    images.value[index].imageUrl = images.value[index].imageUrls[0]
  } else if (editImages.length > 0) {
    images.value[index].images = images.value[index].images || []
    images.value[index].imageUrls = images.value[index].imageUrls || []
    images.value[index].image = images.value[index].images[0]
    images.value[index].imageUrl = images.value[index].imageUrls[0]
  }

  await saveChanges()
}

// 拖拽重排
function handleReorder(fromIndex: number, toIndex: number) {
  console.log('[App] handleReorder', { fromIndex, toIndex })
  console.log('[App] before swap, images[0].id:', images.value[0]?.id, 'images[1].id:', images.value[1]?.id)
  // 使用 splice 强制触发 Vue 响应式更新
  const item = images.value.splice(fromIndex, 1)[0]
  images.value.splice(toIndex, 0, item)
  console.log('[App] after splice swap, images[0].id:', images.value[0]?.id, 'images[1].id:', images.value[1]?.id)
  console.log('[App] after splice swap, images length:', images.value.length)
  // 直接更新 displayedImages
  displayedImages.value = filteredImages.value.slice(0, loadedCount.value)
  console.log('[App] directly updated displayedImages')
  saveChanges()
}

async function deleteImage(index: number) {
  if (!confirm('确定要删除这张图片吗？')) return

  images.value.splice(index, 1)
  try {
    await saveChanges()
    uiStore.showNotification('success', '成功', '删除成功')
  } catch (error: any) {
    uiStore.showNotification('error', '失败', error.message || '删除失败')
  }
}

// 图片查看
function showDetail(image: any) {
  localStorage.setItem('foodDetails', JSON.stringify(image))
  window.open('./detail.html', '_blank')
}

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'
}

// 登录
function closeLoginModal() {
  showLoginModal.value = false
}

function onLoginSuccess() {
  showLoginModal.value = false
  loadPhotos()
}

// 数据加载和保存
async function loadPhotos() {
  loading.value = true
  try {
    const data = await loadJson<{ list: any[] }>('foodData.json')
    if (!data || !data.list) {
      images.value = []
      return
    }

    const list = data.list

    // Load image URLs
    for (const image of list) {
      if (image.image) {
        image.imageUrl = await getPhotoUrl(image.image)
        if (image.images && image.images.length > 0) {
          image.imageUrls = []
          for (const img of image.images) {
            image.imageUrls.push(await getPhotoUrl(img))
          }
        }
      }
    }

    images.value = list
  } catch (error) {
    console.error('加载失败:', error)
    images.value = []
  } finally {
    loading.value = false
  }
}

async function saveChanges(): Promise<void> {
  console.log('[App] saveChanges called')
  const saveObj = JSON.parse(JSON.stringify({ list: images.value }))
  saveObj.list.forEach((image: any) => {
    image.imageUrl = null
    image.imageUrls = []
    if (image.images && image.images.length > 0) {
      image.image = image.images[0]
    } else {
      image.image = null
    }
  })
  console.log('[App] saving to foodData.json, list length:', saveObj.list.length)

  await uploadJson('foodData.json', saveObj)
  console.log('[App] saveChanges completed')
}

// 工具函数
function getOriginalIndex(image: any): number {
  return images.value.indexOf(image)
}
</script>
