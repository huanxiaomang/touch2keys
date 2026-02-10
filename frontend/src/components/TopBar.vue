<template>
  <div
    ref="topBarRef"
    class="fixed top-0 left-0 right-0 z-20 fade-in select-none"
    :style="{ height: `${barHeight}px` }"
  >
    <div class="relative h-full flex items-center justify-between px-6 bg-gradient-to-b from-zinc-900/95 to-zinc-900/90 backdrop-blur-xl border-b border-zinc-800/60 shadow-2xl">
      <!-- 左侧：状态信息（固定宽度） -->
      <div :class="statusClass" class="text-sm font-semibold tracking-wide min-w-[120px]">
        {{ statusText }}
      </div>

      <!-- 中间：功能按钮组（响应式） -->
      <div class="flex items-center gap-3 flex-1 justify-center max-w-2xl">
        <button
          v-for="btn in functionButtons"
          :key="btn.key"
          @click="handleKeyPress(btn.key)"
          :style="buttonStyle"
          class="group relative overflow-hidden bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 hover:from-zinc-700/90 hover:to-zinc-800/90 text-zinc-200 font-semibold rounded-xl border border-zinc-700/60 hover:border-zinc-600/80 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-violet-500/10"
        >
          <span class="relative z-10">{{ btn.label }}</span>
          <div class="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/10 group-hover:to-fuchsia-500/10 transition-all duration-300"></div>
        </button>
      </div>

      <!-- 右侧：模式选择（响应式） -->
      <select
        v-model="selectedMode"
        @change="handleModeChange"
        :style="selectStyle"
        class="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 text-zinc-200 font-semibold rounded-xl border border-zinc-700/60 hover:border-violet-500/50 cursor-pointer hover:from-zinc-700/90 hover:to-zinc-800/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent shadow-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjYTFhMWFhIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10"
      >
        <option value="rizline">🎹 Rizline</option>
        <option value="musedash">🎵 Muse Dash</option>
        <option value="osu">⭕ OSU</option>
      </select>
    </div>

    <!-- 拖拽调节手柄 -->
    <div
      ref="resizeHandleRef"
      @mousedown="startResize"
      @touchstart="startResize"
      class="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize group hover:bg-violet-500/20 transition-colors duration-200"
    >
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-zinc-700/50 group-hover:bg-violet-500/60 rounded-full transition-all duration-200 group-hover:w-24"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { GameMode, StatusType } from '../types'

interface Props {
  status: string
  statusType: StatusType
  currentMode: GameMode
}

interface Emits {
  (e: 'keyPress', key: string): void
  (e: 'modeChange', mode: GameMode): void
  (e: 'heightChange', height: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedMode = ref<GameMode>(props.currentMode)

// 顶栏高度（可调节，默认 60px）
const barHeight = ref(60)
const minHeight = 50
const maxHeight = 150

const functionButtons = [
  { key: 'esc', label: 'ESC' },
  { key: 'enter', label: 'Enter' },
  { key: 'backspace', label: 'Back' },
  { key: 'delete', label: 'Del' },
]

// 响应式按钮样式（根据高度调整）
const buttonStyle = computed(() => {
  const ratio = barHeight.value / 60
  return {
    padding: `${8 * ratio}px ${16 * ratio}px`,
    fontSize: `${14 * ratio}px`,
  }
})

// 响应式选择器样式
const selectStyle = computed(() => {
  const ratio = barHeight.value / 60
  return {
    padding: `${6 * ratio}px ${12 * ratio}px`,
    fontSize: `${13 * ratio}px`,
  }
})

const statusClass = computed(() => {
  const baseClass = 'text-sm font-semibold tracking-wide transition-colors duration-300'
  switch (props.statusType) {
    case 'success':
      return `${baseClass} text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]`
    case 'error':
      return `${baseClass} text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]`
    case 'warning':
      return `${baseClass} text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]`
    default:
      return `${baseClass} text-zinc-400`
  }
})

const statusText = computed(() => props.status)

const handleKeyPress = (key: string) => {
  emit('keyPress', key)
}

const handleModeChange = () => {
  emit('modeChange', selectedMode.value)
}

// 拖拽调节高度
let isResizing = false
let startY = 0
let startHeight = 0

const startResize = (e: MouseEvent | TouchEvent) => {
  isResizing = true
  startY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY
  startHeight = barHeight.value

  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'ns-resize'
}

const doResize = (e: MouseEvent | TouchEvent) => {
  if (!isResizing) return

  const currentY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY
  const delta = currentY - startY
  const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + delta))

  barHeight.value = newHeight
  emit('heightChange', newHeight)
}

const stopResize = () => {
  if (!isResizing) return

  isResizing = false
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

onMounted(() => {
  document.addEventListener('mousemove', doResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', doResize)
  document.addEventListener('touchend', stopResize)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', doResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', doResize)
  document.removeEventListener('touchend', stopResize)
})

// 监听外部模式变化
import { watch } from 'vue'
watch(() => props.currentMode, (newMode) => {
  selectedMode.value = newMode
})

// 暴露高度给父组件
defineExpose({
  barHeight,
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 自定义滚动条样式 */
select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: rgba(39, 39, 42, 0.5);
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.5);
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.7);
}

/* Option 样式 */
select option {
  background: #18181b;
  color: #e4e4e7;
  padding: 8px;
}
</style>

