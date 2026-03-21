import { ref } from 'vue'

export interface UploadFile {
  file: File
  dataUrl: string
}

export function useImageUpload() {
  const selectedFiles = ref<UploadFile[]>([])
  const showUploadPreview = ref(false)

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFiles(files: File[]): Promise<void> {
    selectedFiles.value = []
    for (const file of files) {
      const dataUrl = await readFileAsDataURL(file)
      selectedFiles.value.push({ file, dataUrl })
    }
    showUploadPreview.value = true
  }

  function removePreviewFile(index: number): void {
    selectedFiles.value.splice(index, 1)
    if (selectedFiles.value.length === 0) {
      showUploadPreview.value = false
    }
  }

  function cancelUploadImages(): void {
    selectedFiles.value = []
    showUploadPreview.value = false
    const fileInput = document.getElementById('fileInput') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  function triggerFileInput(): void {
    document.getElementById('fileInput')?.click()
  }

  function handleFileSelect(e: Event): void {
    const target = e.target as HTMLInputElement
    if (target.files) {
      handleFiles(Array.from(target.files))
    }
  }

  function handleDrop(e: DragEvent): void {
    if (e.dataTransfer?.files) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  return {
    selectedFiles,
    showUploadPreview,
    readFileAsDataURL,
    handleFiles,
    removePreviewFile,
    cancelUploadImages,
    triggerFileInput,
    handleFileSelect,
    handleDrop,
  }
}
