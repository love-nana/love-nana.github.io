import { ref, reactive, nextTick } from 'vue'
import type { Ref } from 'vue'

export interface EditForm {
  title: string
  date: string
  desc: string
  category: string
}

export interface EditImage {
  url: string
  file?: File
}

export function useEditModal(
  images: Ref<any[]>,
  onSave?: (index: number, form: EditForm, newImages: EditImage[]) => Promise<void>
) {
  const showEditModal = ref(false)
  const editingIndex = ref(-1)
  const editImages = ref<EditImage[]>([])
  const appendUploadFileMap = ref<Map<number, File>>(new Map())

  const editForm = reactive<EditForm>({
    title: '',
    date: '',
    desc: '',
    category: '日常',
  })

  function openEditModal(index: number, getCosUrlList?: (paths: string[]) => Promise<(string | null)[]>): void {
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

    if (image.images && image.images.length > 0 && getCosUrlList) {
      getCosUrlList(image.images).then(urls => {
        editImages.value = urls.filter((url): url is string => url !== null).map(url => ({ url }))
      })
    }

    showEditModal.value = true
    nextTick(() => {
      const modal = document.getElementById('editModal')
      if (modal) modal.classList.add('active')
      document.body.style.overflow = 'hidden'
    })
  }

  function closeEditModal(): void {
    showEditModal.value = false
    const modal = document.getElementById('editModal')
    if (modal) modal.classList.remove('active')
    document.body.style.overflow = 'auto'
    editingIndex.value = -1
    editImages.value = []
    appendUploadFileMap.value = new Map()
  }

  async function submitEdit(): Promise<void> {
    if (editingIndex.value < 0 || !onSave) return

    images.value[editingIndex.value].title = editForm.title
    images.value[editingIndex.value].date = editForm.date
    images.value[editingIndex.value].desc = editForm.desc
    images.value[editingIndex.value].category = editForm.category

    await onSave(editingIndex.value, editForm, editImages.value)
    closeEditModal()
  }

  function handleAppendFileSelect(e: Event): void {
    const target = e.target as HTMLInputElement
    if (!target.files) return
    handleAppendFiles(Array.from(target.files))
  }

  async function handleAppendFiles(files: File[]): Promise<void> {
    const beforeCount = editImages.value.length
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const dataUrl = await readFileAsDataURL(file)
      const idx = beforeCount + i
      editImages.value.push({ url: dataUrl, file })
      appendUploadFileMap.value.set(idx, file)
    }
  }

  function removeEditImage(index: number): void {
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

  function triggerAppendInput(): void {
    document.getElementById('appendFileInput')?.click()
  }

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Preview drag reordering
  let previewDraggedIndex = -1

  function handlePreviewDragStart(e: DragEvent, index: number) {
    previewDraggedIndex = index
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
    if (previewDraggedIndex !== targetIndex) {
      const imageData = images.value[editingIndex.value]

      // Swap edit images
      ;[editImages.value[previewDraggedIndex], editImages.value[targetIndex]] = [editImages.value[targetIndex], editImages.value[previewDraggedIndex]]

      // Swap in image arrays (COS paths and signed URLs)
      if (imageData.images) {
        ;[imageData.images[previewDraggedIndex], imageData.images[targetIndex]] = [imageData.images[targetIndex], imageData.images[previewDraggedIndex]]
      }
      if (imageData.imageUrls) {
        ;[imageData.imageUrls[previewDraggedIndex], imageData.imageUrls[targetIndex]] = [imageData.imageUrls[targetIndex], imageData.imageUrls[previewDraggedIndex]]
      }

      // Swap in append map
      if (appendUploadFileMap.value.has(previewDraggedIndex) || appendUploadFileMap.value.has(targetIndex)) {
        const tmp = appendUploadFileMap.value.get(previewDraggedIndex)
        appendUploadFileMap.value.set(previewDraggedIndex, appendUploadFileMap.value.get(targetIndex)!)
        appendUploadFileMap.value.set(targetIndex, tmp!)
      }
    }
    previewDraggedIndex = -1
    return false
  }

  // Touch drag state for preview images
  let touchStartX = 0
  let touchStartY = 0
  let draggedPreviewElement: HTMLElement | null = null
  let touchTimeout: any = null

  function handleAppendPicTouchStart(e: TouchEvent, _index?: number) {
    const target = e.target as HTMLElement
    if (target.classList.contains('remove-btn')) return
    e.preventDefault()
    e.stopPropagation()

    // 支持事件委托：尝试从事件目标找到 .preview-item
    let previewItem: HTMLElement
    if (_index !== undefined) {
      previewItem = e.currentTarget as HTMLElement
    } else {
      previewItem = target.closest('.preview-item') as HTMLElement
      if (!previewItem) return
    }

    touchTimeout = setTimeout(() => {
      draggedPreviewElement = previewItem
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      previewItem.classList.add('dragging')
      document.getElementById('modalContent')!.style.overflow = 'hidden'
    }, 100)
  }

  function handleAppendPicTouchMove(e: TouchEvent) {
    if (!draggedPreviewElement) return
    e.preventDefault()
    e.stopPropagation()
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartX
    const deltaY = touch.clientY - touchStartY
    draggedPreviewElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }

  function handleAppendPicTouchEnd(e: TouchEvent) {
    if (touchTimeout) {
      clearTimeout(touchTimeout)
    }
    if (!draggedPreviewElement) return
    e.preventDefault()
    e.stopPropagation()

    // Collision detection
    const elements = Array.from(document.querySelectorAll('#editPreviewList .preview-item:not(.dragging)'))
    const draggedRect = draggedPreviewElement.getBoundingClientRect()
    let swapElement: HTMLElement | null = null

    for (const element of elements) {
      const rect = element.getBoundingClientRect()
      if (
        draggedRect.left < rect.right &&
        draggedRect.right > rect.left &&
        draggedRect.top < rect.bottom &&
        draggedRect.bottom > rect.top
      ) {
        const centerX1 = (draggedRect.left + draggedRect.right) / 2
        const centerY1 = (draggedRect.top + draggedRect.bottom) / 2
        const centerX2 = (rect.left + rect.right) / 2
        const centerY2 = (rect.top + rect.bottom) / 2

        if (Math.abs(centerX1 - centerX2) < 50 && Math.abs(centerY1 - centerY2) < 50) {
          swapElement = element as HTMLElement
          break
        }
      }
    }

    if (swapElement && swapElement !== draggedPreviewElement) {
      const fromIndex = parseInt(draggedPreviewElement.dataset.index || '-1')
      const toIndex = parseInt(swapElement.dataset.index || '-1')
      const imageData = images.value[editingIndex.value]
      handleSwapAppendPic(swapElement, draggedPreviewElement, fromIndex, toIndex, imageData)
    }

    document.querySelectorAll('#editPreviewList .preview-item').forEach(card => {
      ;(card as HTMLElement).classList.remove('dragging')
    })
    draggedPreviewElement.style.transform = ''
    draggedPreviewElement.classList.remove('dragging')
    document.getElementById('modalContent')!.style.overflow = ''
    draggedPreviewElement = null
  }

  function handleSwapAppendPic(target: HTMLElement, dragEle: HTMLElement, fromIndex: number, toIndex: number, imageData: { images?: string[], imageUrls?: string[] }) {
    if (fromIndex === toIndex) return

    // Swap in editImages array
    ;[editImages.value[fromIndex], editImages.value[toIndex]] = [editImages.value[toIndex], editImages.value[fromIndex]]

    // Swap in image arrays (COS paths and signed URLs)
    if (imageData.images) {
      ;[imageData.images[fromIndex], imageData.images[toIndex]] = [imageData.images[toIndex], imageData.images[fromIndex]]
    }
    if (imageData.imageUrls) {
      ;[imageData.imageUrls[fromIndex], imageData.imageUrls[toIndex]] = [imageData.imageUrls[toIndex], imageData.imageUrls[fromIndex]]
    }

    // Swap in appendUploadFileMap
    if (appendUploadFileMap.value.has(fromIndex) || appendUploadFileMap.value.has(toIndex)) {
      const tmp = appendUploadFileMap.value.get(fromIndex)
      appendUploadFileMap.value.set(fromIndex, appendUploadFileMap.value.get(toIndex)!)
      appendUploadFileMap.value.set(toIndex, tmp!)
    }

    // Update dataset.index
    dragEle.dataset.index = String(toIndex)
    target.dataset.index = String(fromIndex)

    // Swap DOM elements
    const editPreviewList = document.getElementById('editPreviewList')
    if (editPreviewList) {
      swapChildren(editPreviewList, fromIndex, toIndex)
    }
  }

  function swapChildren(parent: HTMLElement, index1: number, index2: number) {
    const children = parent.children
    if (index1 < 0 || index2 < 0 || index1 >= children.length || index2 >= children.length) {
      return
    }
    const node1 = children[index1]
    const node2 = children[index2]
    parent.insertBefore(node1, node2)
    parent.insertBefore(node2, children[index1])
  }

  return {
    showEditModal,
    editingIndex,
    editImages,
    appendUploadFileMap,
    editForm,
    openEditModal,
    closeEditModal,
    submitEdit,
    handleAppendFileSelect,
    handleAppendFiles,
    removeEditImage,
    triggerAppendInput,
    handlePreviewDragStart,
    handlePreviewDragEnd,
    handlePreviewDragEnter,
    handlePreviewDrop,
    handleAppendPicTouchStart,
    handleAppendPicTouchMove,
    handleAppendPicTouchEnd,
  }
}
