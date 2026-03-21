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
      openDatePicker()
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

  function openDatePicker(): void {
    const dateInput = document.getElementById('imageDate') as HTMLInputElement
    if (!dateInput) return

    dateInput.addEventListener('click', () => {
      const dateStr = prompt('请输入日期 (格式: YYYY-MM-DD):', editForm.date)
      if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        editForm.date = dateStr
      }
    })
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
      // Swap edit images
      ;[editImages.value[previewDraggedIndex], editImages.value[targetIndex]] = [editImages.value[targetIndex], editImages.value[previewDraggedIndex]]

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
  }
}
