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

  // Touch drag state
  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const dragStartIndex = ref(-1)
  const currentDragElement = ref<HTMLElement | null>(null)

  function handleDragStart(e: DragEvent, image: any, index: number) {
    draggedItem.value = image
    draggedIndex.value = index
    const card = (e.target as HTMLElement).closest('.image-card')
    if (card) card.classList.add('dragging')
    e.dataTransfer!.effectAllowed = 'move'
    // 移除 setData，避免浏览器默认行为干扰 drop 事件
  }

  function handleDragEnd(e: DragEvent) {
    const card = (e.target as HTMLElement).closest('.image-card')
    if (card) card.classList.remove('dragging')
    document.querySelectorAll('.image-card').forEach(c => {
      c.classList.remove('over')
    })
    isDragging.value = false
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    return false
  }

  function handleDragEnter(e: DragEvent) {
    const card = (e.target as HTMLElement).closest('.image-card')
    if (card) card.classList.add('over')
  }

  function handleDragLeave(e: DragEvent) {
    const card = (e.target as HTMLElement).closest('.image-card')
    if (card) card.classList.remove('over')
  }

  function handleCardDrop(e: DragEvent, targetImage: any, _targetIndex: number) {
    e.stopPropagation()
    console.log('[DragDrop] DROP event fired', { dragged: draggedItem.value?.id, target: targetImage?.id })
    if (draggedItem.value !== targetImage) {
      const fromIndex = items.value.indexOf(draggedItem.value)
      const toIndex = items.value.indexOf(targetImage)
      console.log('[DragDrop] INDICES', { fromIndex, toIndex })
      if (fromIndex !== -1 && toIndex !== -1 && onReorder) {
        onReorder(fromIndex, toIndex)
      }
    }
    return false
  }

  // Touch events for mobile reordering
  function handleTouchStart(e: TouchEvent, image: any, index: number) {
    if ((e.target as HTMLElement).classList.contains('action-btn')) return
    touchTimeout = setTimeout(() => {
      draggedElement.value = image
      currentDragElement.value = e.currentTarget as HTMLElement
      dragStartIndex.value = index
      const touch = e.touches[0]
      touchStartX.value = touch.clientX
      touchStartY.value = touch.clientY
      ;(e.currentTarget as HTMLElement).classList.add('dragging')
      document.body.style.overflow = 'hidden'
      // 添加非 passive 的 touchmove 监听器，确保 preventDefault 生效
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
    }, 1000)
  }

  function handleTouchMove(e: TouchEvent) {
    if (!draggedElement.value || !currentDragElement.value) return
    e.preventDefault()

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartX.value
    const deltaY = touch.clientY - touchStartY.value

    // Update dragged element position
    currentDragElement.value.style.transform = `translate(${deltaX}px, ${deltaY}px)`

    // Collision detection
    const elements = Array.from(document.querySelectorAll('.image-card:not(.dragging)'))
    const draggedRect = currentDragElement.value.getBoundingClientRect()

    for (const element of elements) {
      const rect = element.getBoundingClientRect()

      // Boundary overlap detection
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

        // Center point distance < 50px triggers swap
        if (Math.abs(centerX1 - centerX2) < 50 && Math.abs(centerY1 - centerY2) < 50) {
          const fromIndex = dragStartIndex.value
          const toIndex = parseInt((element as HTMLElement).dataset.index || '-1')

          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            if (onReorder) {
              onReorder(fromIndex, toIndex)
            }
            dragStartIndex.value = toIndex
          }
          break
        }
      }
    }
  }

  function handleTouchEnd(_e: TouchEvent) {
    if (touchTimeout) {
      clearTimeout(touchTimeout)
    }
    document.querySelectorAll('.image-card').forEach(card => {
      card.classList.remove('dragging')
    })
    if (currentDragElement.value) {
      currentDragElement.value.style.transform = ''
      currentDragElement.value.classList.remove('dragging')
    }
    document.body.style.overflow = ''
    // 移除非 passive 的 touchmove 监听器
    document.removeEventListener('touchmove', handleTouchMove)
    draggedElement.value = null
    currentDragElement.value = null
    dragStartIndex.value = -1
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
