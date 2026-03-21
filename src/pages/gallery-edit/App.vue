<template>
<div class="container">
    <div class="header-bg" id="header-bg" @click="goToGallery"></div>
    <div class="actions">
        <button class="fit-btn btn-secondary" id="addImageBtn" @click="triggerFileInput">
            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            添加我们的故事
        </button>
        <input type="file" id="fileInput" class="file-input" accept="image/jpeg,image/png,image/gif" multiple @change="handleFileSelect"/>
    </div>

    <div class="drop-zone" id="dropZone" :class="{ active: isDragging }" @dragover.prevent @drop.prevent="handleDrop" @dragenter="isDragging = true" @dragleave="isDragging = false">
        <p>拖拽图片到这里上传，或点击上方"添加图片"按钮</p>
    </div>

    <!-- 上传预览区域 -->
    <div class="upload-preview" id="uploadPreview" :class="{ active: showUploadPreview }">
        <h3 class="preview-title">预览上传的图片</h3>
        <div class="preview-list" id="previewList">
            <div v-for="(file, index) in selectedFiles" :key="index" class="preview-item" :data-index="index">
                <img :src="file.dataUrl" class="preview-image">
                <button class="remove-btn" @click="removePreviewFile(index)">×</button>
            </div>
        </div>
        <div class="upload-actions">
            <button class="btn btn-cancel" id="cancelUpload" @click="cancelUploadImages">取消</button>
            <button class="btn btn-secondary" id="confirmUpload" @click="confirmUploadImages">确认上传</button>
        </div>
    </div>

    <!-- 分类   -->
    <CategoryFilter v-model="currentCategoryFilter" />

    <div class="gallery" id="imageGallery">
        <div v-if="images.length === 0" class="empty-state">
            <h3>还没有图片</h3>
            <p>点击"添加图片"按钮上传您的第一张图片</p>
        </div>
        <div v-for="(image, idx) in filteredImages" :key="image.id || idx"
             class="image-card" :data-index="getOriginalIndex(image)" draggable="true"
             @dragstart="handleDragStart($event, image, idx)"
             @dragend="handleDragEnd"
             @dragover="handleDragOver"
             @dragenter="handleDragEnter"
             @dragleave="handleDragLeave"
             @drop="handleCardDrop($event, image, idx)"
             @touchstart="handleTouchStart($event, image, idx)"
             @touchmove="handleTouchMove($event)"
             @touchend="handleTouchEnd"
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
    <div id="endMessage" class="load-more-end-message" :style="{ display: hasMore ? 'none' : 'block' }">
        没有更多内容了
    </div>

    <!-- 编辑图片信息的模态框 -->
    <div class="modal" id="editModal" :class="{ active: showEditModal }">
        <div class="modal-content" id="modalContent">
            <div class="modal-header">
                <h3 class="modal-title">编辑图片信息</h3>
                <i class="fa-solid fa-circle-xmark close-edit-btn" @click="closeEditModal"></i>
            </div>
            <div class="btn-append-container">
                <button type="button" class="btn-append-pic" id="appendPicBtn" @click="triggerAppendInput">添加图片</button>
                <input type="file" id="appendFileInput" class="file-input" accept="image/*" multiple @change="handleAppendFileSelect"/>
            </div>
            <!-- 上传预览区域 -->
            <div class="edit-preview" id="editPreview" :class="{ active: editImages.length > 0 }">
                <div class="preview-list" id="editPreviewList">
                    <div v-for="(img, idx) in editImages" :key="idx" class="preview-item" :data-index="idx" draggable="true"
                         @dragstart="handlePreviewDragStart($event, idx)"
                         @dragend="handlePreviewDragEnd"
                         @dragover="handleDragOver"
                         @dragenter="handlePreviewDragEnter"
                         @dragleave="handleDragLeave"
                         @drop="handlePreviewDrop($event, idx)">
                        <img :src="img.url" @error="handleImageError">
                        <button class="remove-btn" @click="removeEditImage(idx)">×</button>
                    </div>
                </div>
            </div>
            <form id="imageForm" @submit.prevent="submitEdit">
                <input type="hidden" id="editIndex">
                <div class="form-group">
                    <label for="imageTitle">图片标题</label>
                    <input type="text" class="form-control" id="imageTitle" v-model="editForm.title" placeholder="输入图片标题">
                </div>
                <div class="form-group">
                    <label for="imageDate">图片日期</label>
                    <input type="text" id="imageDate" class="form-control" v-model="editForm.date" placeholder="点击选择日期" readonly @click="openDatePicker">
                </div>

                <div class="form-group">
                    <label for="imageCategory">分类</label>
                    <select id="imageCategory" class="form-control" v-model="editForm.category">
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
                            <textarea id="imageDescription" rows="8" v-model="editForm.desc" placeholder="输入图片描述" ref="descriptionTextarea"></textarea>
                            <div class="resize-handle" id="resize-handle" @mousedown="initResize" @touchstart="initResize"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-cancel" id="cancelEdit" @click="closeEditModal">取消</button>
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

<!-- 通知弹窗 -->
<div class="notification" id="notification" :class="[notifyType, { active: showNotification }]">
    <div class="notification-icon">!</div>
    <div class="notification-content">
        <div class="notification-title" id="notificationTitle">{{ notifyTitle }}</div>
        <div class="notification-message" id="notificationMessage">{{ notifyMessage }}</div>
    </div>
</div>

<!--登录信息弹窗-->
<div class="msg-modal-overlay" id="modalOverlay" :class="{ active: showLoginModal }">
    <div class="msg-modal">
        <div class="msg-modal-header">
            <h2>权限信息</h2>
        </div>
        <form id="loginForm" class="msg-form" @submit.prevent="handleLogin">
            <div class="msg-form-group">
                <label for="cosId">ID</label>
                <input type="text" id="cosId" v-model="loginForm.cosId" placeholder="请输入ID" required>
                <div class="msg-error-message" id="usernameError" v-if="loginErrors.cosId">{{ loginErrors.cosId }}</div>
            </div>
            <div class="msg-form-group">
                <label for="cosToken">密钥</label>
                <input type="password" id="cosToken" v-model="loginForm.cosToken" placeholder="请输入您的密钥" required>
                <div class="msg-error-message" id="passwordError" v-if="loginErrors.cosToken">{{ loginErrors.cosToken }}</div>
            </div>
            <div class="msg-form-group">
                <label for="user">用户</label>
                <select id="user" v-model="loginForm.user">
                    <option value="娜宝">娜宝</option>
                    <option value="温宝">温宝</option>
                </select>
            </div>
            <div class="msg-form-footer">
                <button type="button" class="login-btn login-btn-secondary" id="cancelBtn" @click="closeLoginModal">取消</button>
                <button type="submit" class="login-btn login-btn-cancel">保存</button>
            </div>
        </form>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import COS from 'cos-js-sdk-v5'
import CategoryFilter from '@/components/CategoryFilter.vue'
import type { Category } from '@/types'

// COS 配置
const COS_CONFIG = {
  bucket: 'lovel-nana-1259397844',
  region: 'ap-guangzhou',
}

// 数据
const images = ref<any[]>([])
const selectedFiles = ref<Array<{ file: File; dataUrl: string }>>([])
const editImages = ref<Array<{ url: string; file?: File }>>([])
const appendUploadFileMap = ref<Map<number, File>>(new Map())

// 状态
const loading = ref(false)
const hasMore = ref(false)
const showEditModal = ref(false)
const showLoading = ref(false)
const showNotification = ref(false)
const showLoginModal = ref(false)
const isDragging = ref(false)
const showUploadPreview = ref(false)
const currentCategoryFilter = ref<Category>('all')
const editingIndex = ref(-1)
const notifyType = ref('')
const notifyTitle = ref('')
const notifyMessage = ref('')

const editForm = reactive({
  title: '',
  date: '',
  desc: '',
  category: '日常'
})

const loginForm = reactive({
  cosId: '',
  cosToken: '',
  user: '娜宝'
})

const loginErrors = reactive({
  cosId: '',
  cosToken: ''
})

// 拖拽状态
let draggedItem: any = null
let draggedIndex = -1
let touchTimeout: any = null
let draggedElement: any = null

let cos: COS | null = null

// 计算属性
const filteredImages = computed(() => {
  if (currentCategoryFilter.value === 'all') {
    return images.value
  }
  return images.value.filter(img => img.category === currentCategoryFilter.value)
})

// 初始化
onMounted(() => {
  initCos()
  initLoginModal()
  initResize()
  loadHeaderBg()
})

function initCos() {
  const secretId = localStorage.getItem('local_cosId')
  const secretKey = localStorage.getItem('local_cosToken')
  if (secretId && secretKey) {
    cos = new COS({ SecretId: secretId, SecretKey: secretKey })
    loadPhotos()
  } else {
    setTimeout(() => {
      showLoginModal.value = true
    }, 500)
  }
}

function initLoginModal() {
  // Modal events handled by Vue
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

function loadHeaderBg() {
  getCosUrl('assert/header-bg.jpg').then(res => {
    const headerBg = document.getElementById('header-bg')
    if (headerBg && res) {
      headerBg.style.backgroundImage = `url(${res})`
    }
  })
}

function goToGallery() {
  window.open('./gallery.html', '_blank')
}

// 文件上传相关
function triggerFileInput() {
  document.getElementById('fileInput')?.click()
}

function triggerAppendInput() {
  document.getElementById('appendFileInput')?.click()
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    handleFiles(Array.from(target.files))
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    handleFiles(Array.from(e.dataTransfer.files))
  }
}

async function handleFiles(files: File[]) {
  selectedFiles.value = []
  for (const file of files) {
    const dataUrl = await readFileAsDataURL(file)
    selectedFiles.value.push({ file, dataUrl })
  }
  showUploadPreview.value = true
}

function removePreviewFile(index: number) {
  selectedFiles.value.splice(index, 1)
  if (selectedFiles.value.length === 0) {
    showUploadPreview.value = false
  }
}

function cancelUploadImages() {
  selectedFiles.value = []
  showUploadPreview.value = false
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

async function confirmUploadImages() {
  if (selectedFiles.value.length === 0) {
    alert('请选择要上传的图片')
    return
  }

  showLoading.value = true
  try {
    const newImages = []
    for (const { file } of selectedFiles.value) {
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `nana/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`

      await putObject(fileName, file)

      const imageUrl = await getCosUrl(fileName)
      newImages.push({
        id: fileName,
        image: fileName,
        imageUrl: imageUrl,
        title: file.name.replace(/\.[^.]+$/, ''),
        category: '日常',
        user: localStorage.getItem('local_user') || '娜宝',
        date: new Date().toISOString().split('T')[0],
        images: [fileName],
        imageUrls: [imageUrl]
      })
    }

    images.value = [...newImages, ...images.value]
    await saveChanges()
    cancelUploadImages()
    showNotify('success', '成功', `上传了 ${newImages.length} 张图片`)
  } catch (error: any) {
    showNotify('error', '失败', error.message || '上传失败')
  } finally {
    showLoading.value = false
  }
}

function handleAppendFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files) return
  handleAppendFiles(Array.from(target.files))
}

async function handleAppendFiles(files: File[]) {
  const beforeCount = editImages.value.length
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const dataUrl = await readFileAsDataURL(file)
    const idx = beforeCount + i
    editImages.value.push({ url: dataUrl, file })
    appendUploadFileMap.value.set(idx, file)
  }
}

function removeEditImage(index: number) {
  editImages.value.splice(index, 1)
  appendUploadFileMap.value.delete(index)
  // Re-index the map
  const newMap = new Map<number, File>()
  editImages.value.forEach((_, i) => {
    if (appendUploadFileMap.value.has(index + i + 1)) {
      newMap.set(i, appendUploadFileMap.value.get(index + i + 1)!)
    }
  })
  appendUploadFileMap.value = newMap
}

// 编辑模态框
function openEditModal(index: number) {
  editingIndex.value = index
  const image = images.value[index]
  if (!image) return

  editForm.title = image.title || ''
  editForm.date = image.date || ''
  editForm.desc = image.desc || ''
  editForm.category = image.category || '日常'

  // Load existing images
  editImages.value = []
  appendUploadFileMap.value = new Map()

  if (image.images && image.images.length > 0) {
    getCosUrlList(image.images).then(urls => {
      editImages.value = urls.map(url => ({ url }))
    })
  }

  showEditModal.value = true
  nextTick(() => {
    const modal = document.getElementById('editModal')
    if (modal) modal.classList.add('active')
    document.body.style.overflow = 'hidden'
    openDatePicker()
  })
}

function closeEditModal() {
  showEditModal.value = false
  const modal = document.getElementById('editModal')
  if (modal) modal.classList.remove('active')
  document.body.style.overflow = 'auto'
  editingIndex.value = -1
  editImages.value = []
  appendUploadFileMap.value = new Map()
}

function openDatePicker() {
  // Simple date picker - in production use a proper library
  const dateInput = document.getElementById('imageDate') as HTMLInputElement
  if (!dateInput) return

  dateInput.addEventListener('click', () => {
    const dateStr = prompt('请输入日期 (格式: YYYY-MM-DD):', editForm.date)
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      editForm.date = dateStr
    }
  })
}

async function submitEdit() {
  if (editingIndex.value < 0) return

  const index = editingIndex.value
  images.value[index].title = editForm.title
  images.value[index].date = editForm.date
  images.value[index].desc = editForm.desc
  images.value[index].category = editForm.category

  // Handle new uploaded images
  if (appendUploadFileMap.value.size > 0) {
    showLoading.value = true
    try {
      const uploadList: File[] = []
      const indices: number[] = []
      appendUploadFileMap.value.forEach((file, idx) => {
        uploadList.push(file)
        indices.push(idx)
      })

      const results = await uploadFiles(uploadList)
      for (let i = 0; i < results.length; i++) {
        const imgIndex = indices[i]
        if (!images.value[index].images) images.value[index].images = []
        if (!images.value[index].imageUrls) images.value[index].imageUrls = []
        images.value[index].images[imgIndex] = results[i]
        images.value[index].imageUrls[imgIndex] = await getCosUrl(results[i])
      }
      images.value[index].image = images.value[index].images[0]
      images.value[index].imageUrl = images.value[index].imageUrls[0]
    } finally {
      showLoading.value = false
    }
  } else if (editImages.value.length > 0) {
    images.value[index].images = images.value[index].images || []
    images.value[index].imageUrls = images.value[index].imageUrls || []
    images.value[index].image = images.value[index].images[0]
    images.value[index].imageUrl = images.value[index].imageUrls[0]
  }

  await saveChanges()
  closeEditModal()
  showNotify('success', '成功', '保存成功')
}

async function deleteImage(index: number) {
  if (!confirm('确定要删除这张图片吗？')) return

  images.value.splice(index, 1)
  try {
    await saveChanges()
    showNotify('success', '成功', '删除成功')
  } catch (error: any) {
    showNotify('error', '失败', error.message || '删除失败')
  }
}

// 拖拽相关
function handleDragStart(e: DragEvent, image: any, index: number) {
  draggedItem = image
  draggedIndex = index
  ;(e.target as HTMLElement).classList.add('dragging')
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('text/html', (e.target as HTMLElement).innerHTML)
}

function handleDragEnd(e: DragEvent) {
  ;(e.target as HTMLElement).classList.remove('dragging')
  document.querySelectorAll('.image-card').forEach(card => {
    card.classList.remove('over')
  })
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  return false
}

function handleDragEnter(e: DragEvent) {
  ;(e.target as HTMLElement).classList.add('over')
}

function handleDragLeave(e: DragEvent) {
  ;(e.target as HTMLElement).classList.remove('over')
}

function handleCardDrop(e: DragEvent, targetImage: any, _targetIndex: number) {
  e.stopPropagation()
  if (draggedItem !== targetImage) {
    const fromIndex = images.value.indexOf(draggedItem)
    const toIndex = images.value.indexOf(targetImage)
    // Swap
    ;[images.value[fromIndex], images.value[toIndex]] = [images.value[toIndex], images.value[fromIndex]]
    saveChanges()
  }
  return false
}

// 触摸事件
function handleTouchStart(e: TouchEvent, image: any, _index: number) {
  if ((e.target as HTMLElement).classList.contains('action-btn')) return
  touchTimeout = setTimeout(() => {
    draggedElement = image
    ;(e.currentTarget as HTMLElement).classList.add('dragging')
    document.body.style.overflow = 'hidden'
  }, 1000)
}

function handleTouchMove(e: TouchEvent) {
  if (!draggedElement) return
  e.preventDefault()
}

function handleTouchEnd(e: TouchEvent) {
  if (touchTimeout) {
    clearTimeout(touchTimeout)
  }
  document.querySelectorAll('.image-card').forEach(card => {
    card.classList.remove('dragging')
  })
  if (!draggedElement) return
  ;(e.currentTarget as HTMLElement).style.transform = ''
  ;(e.currentTarget as HTMLElement).classList.remove('dragging')
  document.body.style.overflow = ''
  draggedElement = null
}

// 预览图片拖拽
function handlePreviewDragStart(e: DragEvent, index: number) {
  draggedIndex = index
  ;(e.target as HTMLElement).classList.add('dragging')
  e.dataTransfer!.effectAllowed = 'move'
}

function handlePreviewDragEnd(e: DragEvent) {
  ;(e.target as HTMLElement).classList.remove('dragging')
  document.querySelectorAll('#editPreviewList .preview-item').forEach(card => {
    card.classList.remove('over')
  })
}

function handlePreviewDragEnter(e: DragEvent) {
  ;(e.target as HTMLElement).classList.add('over')
}

function handlePreviewDrop(e: DragEvent, targetIndex: number) {
  e.stopPropagation()
  if (draggedIndex !== targetIndex) {
    // Swap edit images
    ;[editImages.value[draggedIndex], editImages.value[targetIndex]] = [editImages.value[targetIndex], editImages.value[draggedIndex]]

    // Swap in append map
    if (appendUploadFileMap.value.has(draggedIndex) || appendUploadFileMap.value.has(targetIndex)) {
      const tmp = appendUploadFileMap.value.get(draggedIndex)
      appendUploadFileMap.value.set(draggedIndex, appendUploadFileMap.value.get(targetIndex)!)
      appendUploadFileMap.value.set(targetIndex, tmp!)
    }
  }
  return false
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

// 登录相关
function closeLoginModal() {
  showLoginModal.value = false
}

function handleLogin() {
  loginErrors.cosId = ''
  loginErrors.cosToken = ''

  if (!loginForm.cosId.trim()) {
    loginErrors.cosId = 'ID不能为空'
    return
  }
  if (!loginForm.cosToken.trim()) {
    loginErrors.cosToken = '密钥不能为空'
    return
  }

  localStorage.setItem('local_cosId', loginForm.cosId)
  localStorage.setItem('local_cosToken', loginForm.cosToken)
  localStorage.setItem('local_user', loginForm.user)

  cos = new COS({ SecretId: loginForm.cosId, SecretKey: loginForm.cosToken })
  closeLoginModal()
  loadPhotos()
}

// 数据加载和保存
async function loadPhotos() {
  loading.value = true
  try {
    const url = await getCosUrl('foodData.json', false)
    if (!url) {
      images.value = []
      return
    }

    const response = await fetch(url)
    if (!response.ok) {
      images.value = []
      return
    }

    const data = await response.json()
    const list = data.list || []

    // Load image URLs
    for (const image of list) {
      if (image.image) {
        image.imageUrl = await getCosUrl(image.image)
        if (image.images && image.images.length > 0) {
          image.imageUrls = []
          for (const img of image.images) {
            image.imageUrls.push(await getCosUrl(img))
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
  if (!cos) throw new Error('未登录')

  showLoading.value = true
  try {
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

    const content = JSON.stringify(saveObj)
    await uploadStrFile('foodData.json', content)
  } finally {
    showLoading.value = false
  }
}

// COS 操作
function putObject(key: string, body: File): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!cos) {
      reject(new Error('未登录'))
      return
    }
    cos.putObject({
      Bucket: COS_CONFIG.bucket,
      Region: COS_CONFIG.region,
      Key: key,
      Body: body,
    }, (err: any) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function uploadFiles(files: File[]): Promise<string[]> {
  return Promise.all(files.map(file => {
    return new Promise<string>((resolve, reject) => {
      const ext = file.name.split('.').pop() || 'jpg'
      const key = `nana/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
      cos!.putObject({
        Bucket: COS_CONFIG.bucket,
        Region: COS_CONFIG.region,
        Key: key,
        Body: file,
      }, (err: any) => {
        if (err) reject(err)
        else resolve(key)
      })
    })
  }))
}

function uploadStrFile(filename: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!cos) {
      reject(new Error('未登录'))
      return
    }
    cos.putObject({
      Bucket: COS_CONFIG.bucket,
      Region: COS_CONFIG.region,
      Key: filename,
      Body: content,
      ContentType: 'application/json'
    }, (err: any) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

async function getCosUrl(filePath: string, _useCache = true): Promise<string | null> {
  if (!cos) return null
  if (filePath.length > 1000) return null

  const cached = getPicFromCache(filePath)
  if (cached) return cached

  return new Promise((resolve) => {
    cos!.getObjectUrl({
      Bucket: COS_CONFIG.bucket,
      Region: COS_CONFIG.region,
      Key: filePath,
      Sign: true,
      Protocol: 'https:'
    }, (err: any, data: any) => {
      if (err) {
        resolve(null)
        return
      }
      const url = typeof data === 'string' ? data : data.Url
      if (url) savePicToCache(filePath, url)
      resolve(url)
    })
  })
}

async function getCosUrlList(filePaths: string[]): Promise<string[]> {
  const results = await Promise.all(filePaths.map(path => getCosUrl(path)))
  return results.filter((url): url is string => url !== null)
}

function savePicToCache(imageName: string, imgUrl: string) {
  localStorage.setItem(imageName, JSON.stringify({
    url: imgUrl,
    timestamp: Date.now()
  }))
}

function getPicFromCache(imageName: string): string | null {
  const curStamp = Date.now()
  const cacheInfo = localStorage.getItem(imageName)
  if (!cacheInfo) return null

  try {
    const parsed = JSON.parse(cacheInfo)
    if (parsed && parsed.url) {
      const bornMin = Math.ceil((curStamp - parsed.timestamp) / (1000 * 60))
      if (bornMin >= 14) {
        localStorage.removeItem(imageName)
        return null
      }
      return parsed.url
    }
  } catch {
    const parts = cacheInfo.split(',')
    if (parts.length >= 2) {
      const bornMin = Math.ceil((curStamp - parseInt(parts[1])) / (1000 * 60))
      if (bornMin >= 14) {
        localStorage.removeItem(imageName)
        return null
      }
      return parts[0]
    }
  }
  return null
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 工具函数
function getOriginalIndex(image: any): number {
  return images.value.indexOf(image)
}

function showNotify(type: string, title: string, message: string) {
  notifyType.value = type
  notifyTitle.value = title
  notifyMessage.value = message
  showNotification.value = true

  const notification = document.getElementById('notification')
  if (notification) notification.classList.add('active')

  setTimeout(() => {
    showNotification.value = false
    if (notification) notification.classList.remove('active')
  }, 3000)
}
</script>
