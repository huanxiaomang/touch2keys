<template>
  <Teleport to="body">
    <div
      v-for="dot in activeDots"
      :key="dot.id"
      class="touch-dot"
      :class="getDotClass(dot)"
      :style="getDotStyle(dot)"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TouchFeedbackData, GameMode } from '../types'

interface Props {
  currentMode: GameMode
}

const props = defineProps<Props>()

interface DotData extends TouchFeedbackData {
  timestamp: number
  visible: boolean
}

const activeDots = ref<DotData[]>([])
let dotIdCounter = 0

const addDot = (data: TouchFeedbackData) => {
  const dot: DotData = {
    ...data,
    id: dotIdCounter++,
    timestamp: Date.now(),
    visible: true,
  }

  activeDots.value.push(dot)

  // 淡出动画
  setTimeout(() => {
    dot.visible = false
  }, 50)

  // 移除
  setTimeout(() => {
    const index = activeDots.value.findIndex(d => d.id === dot.id)
    if (index !== -1) {
      activeDots.value.splice(index, 1)
    }
  }, 400)
}

const getDotClass = (dot: DotData) => {
  if (props.currentMode === 'musedash') {
    return dot.side === 'left' ? 'left-side' : 'right-side'
  }
  return ''
}

const getDotStyle = (dot: DotData) => {
  const baseStyle = {
    left: `${dot.x_percent * 100}vw`,
    top: `${dot.y_percent * 100}vh`,
    display: 'block',
  }

  if (props.currentMode === 'rizline') {
    return {
      ...baseStyle,
      background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.05) 70%)',
      border: '2px solid rgba(168,85,247,0.6)',
      boxShadow: '0 0 15px rgba(168,85,247,0.4)',
      opacity: dot.visible ? '1' : '0',
      transform: dot.visible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(1.3)',
    }
  }

  return {
    ...baseStyle,
    opacity: dot.visible ? '1' : '0',
    transform: dot.visible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(1.3)',
  }
}

// 暴露方法给父组件
defineExpose({
  addDot,
})
</script>

<style scoped>
@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.touch-dot {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 5;
  display: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.touch-dot::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  animation: pulse-ring 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.left-side {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.05) 70%);
  border: 2px solid rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
}

.left-side::before {
  border: 2px solid rgba(139, 92, 246, 0.5);
}

.right-side {
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.05) 70%);
  border: 2px solid rgba(236, 72, 153, 0.6);
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
}

.right-side::before {
  border: 2px solid rgba(236, 72, 153, 0.5);
}
</style>

