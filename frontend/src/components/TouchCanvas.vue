<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0"
    :class="{ 'pointer-events-none': disabled }"
    @touchstart.prevent="handleTouchStart"
    @touchend.prevent="handleTouchEnd"
    @touchcancel.prevent="handleTouchCancel"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { TouchEventType } from '../types'

interface Props {
  disabled?: boolean
}

interface Emits {
  (e: 'touch', type: TouchEventType, touch: Touch, x: number, y: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const resize = () => {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

const sendTouchEvent = (type: TouchEventType, touch: Touch) => {
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = (touch.clientX - rect.left) / rect.width
  const y = (touch.clientY - rect.top) / rect.height

  emit('touch', type, touch, x, y)
}

const handleTouchStart = (e: TouchEvent) => {
  for (const touch of Array.from(e.changedTouches)) {
    sendTouchEvent('down', touch)
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  for (const touch of Array.from(e.changedTouches)) {
    sendTouchEvent('up', touch)
  }
}

const handleTouchCancel = (e: TouchEvent) => {
  for (const touch of Array.from(e.changedTouches)) {
    sendTouchEvent('cancel', touch)
  }
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
canvas {
  touch-action: none;
}

.pointer-events-none {
  pointer-events: none;
}
</style>

