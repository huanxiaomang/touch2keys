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
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

@keyframes dot-appear {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes glow-pulse {
  0%, 100% {
    filter: brightness(1) blur(0px);
  }
  50% {
    filter: brightness(1.3) blur(2px);
  }
}

.touch-dot {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 50;
  display: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: dot-appear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.touch-dot::before {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  animation: pulse-ring 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.touch-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: inherit;
  filter: blur(8px);
  opacity: 0.6;
  animation: glow-pulse 0.4s ease-in-out;
}

.left-side {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.05) 100%);
  border: 3px solid rgba(139, 92, 246, 0.8);
  box-shadow:
    0 0 20px rgba(139, 92, 246, 0.6),
    0 0 40px rgba(139, 92, 246, 0.3),
    inset 0 0 20px rgba(139, 92, 246, 0.2);
}

.left-side::before {
  border: 3px solid rgba(139, 92, 246, 0.6);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
}

.right-side {
  background: radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, rgba(236, 72, 153, 0.2) 50%, rgba(236, 72, 153, 0.05) 100%);
  border: 3px solid rgba(236, 72, 153, 0.8);
  box-shadow:
    0 0 20px rgba(236, 72, 153, 0.6),
    0 0 40px rgba(236, 72, 153, 0.3),
    inset 0 0 20px rgba(236, 72, 153, 0.2);
}

.right-side::before {
  border: 3px solid rgba(236, 72, 153, 0.6);
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
}
</style>

