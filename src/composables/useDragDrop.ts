import { ref } from 'vue'
import type { Ref } from 'vue'

export interface DragState {
  draggedItem: any
  draggedIndex: number
  draggedElement: any
}

export function useDragDrop(
  items: Ref<any[]>,
  onReorder?: (fromIndex: number, toIndex: number) => void
) {
  const isDragging = ref(false)
  const draggedItem = ref<any>(null)
  const draggedIndex = ref(-1)
  const draggedElement = ref<any>(null)
  let touchTimeout: any = null

  function handleDragStart(e: DragEvent, image: any, index: number) {
    draggedItem.value = image
    draggedIndex.value = index
    ;(e.target as HTMLElement).classList.add('dragging')
    e.dataTransfer!.effectAllowed = 'move'
    e.dataTransfer!.setData('text/html', (e.target as HTMLElement).innerHTML)
  }

  function handleDragEnd(e: DragEvent) {
    ;(e.target as HTMLElement).classList.remove('dragging')
    document.querySelectorAll('.image-card').forEach(card => {
      card.classList.remove('over')
    })
    isDragging.value = false
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
    if (draggedItem.value !== targetImage) {
      const fromIndex = items.value.indexOf(draggedItem.value)
      const toIndex = items.value.indexOf(targetImage)
      if (fromIndex !== -1 && toIndex !== -1 && onReorder) {
        onReorder(fromIndex, toIndex)
      }
    }
    return false
  }

  // Touch events for mobile reordering
  function handleTouchStart(e: TouchEvent, image: any, _index: number) {
    if ((e.target as HTMLElement).classList.contains('action-btn')) return
    touchTimeout = setTimeout(() => {
      draggedElement.value = image
      ;(e.currentTarget as HTMLElement).classList.add('dragging')
      document.body.style.overflow = 'hidden'
    }, 1000)
  }

  function handleTouchMove(e: TouchEvent) {
    if (!draggedElement.value) return
    e.preventDefault()
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchTimeout) {
      clearTimeout(touchTimeout)
    }
    document.querySelectorAll('.image-card').forEach(card => {
      card.classList.remove('dragging')
    })
    if (!draggedElement.value) return
    ;(e.currentTarget as HTMLElement).style.transform = ''
    ;(e.currentTarget as HTMLElement).classList.remove('dragging')
    document.body.style.overflow = ''
    draggedElement.value = null
  }

  // Preview image drag (for edit modal)
  const previewDraggedIndex = ref(-1)

  function handlePreviewDragStart(e: DragEvent, index: number) {
    previewDraggedIndex.value = index
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
    if (previewDraggedIndex.value !== targetIndex) {
      // Swap is handled by the caller
    }
    return false
  }

  return {
    isDragging,
    draggedItem,
    draggedIndex,
    draggedElement,
    previewDraggedIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleCardDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePreviewDragStart,
    handlePreviewDragEnd,
    handlePreviewDragEnter,
    handlePreviewDrop,
  }
}
