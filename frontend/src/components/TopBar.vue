<template>
  <div class="fixed top-0 left-0 right-0 z-20 fade-in">
    <div class="flex items-center justify-between p-3 bg-[#18181b]/80 backdrop-blur-sm border-b border-zinc-800/50">
      <!-- 左侧：状态信息 -->
      <div :class="statusClass" class="text-sm font-medium">
        {{ statusText }}
      </div>

      <!-- 中间：功能按钮组 -->
      <div class="flex items-center gap-3">
        <button
          v-for="btn in functionButtons"
          :key="btn.key"
          @click="handleKeyPress(btn.key)"
          class="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 text-sm font-medium rounded-lg border border-zinc-700/50 transition-colors duration-150 active:bg-zinc-600/80"
        >
          {{ btn.label }}
        </button>
      </div>

      <!-- 右侧：模式选择 -->
      <select
        v-model="selectedMode"
        @change="handleModeChange"
        class="px-3 py-1.5 bg-zinc-800/80 text-zinc-300 text-xs font-medium rounded-md border border-zinc-700/50 cursor-pointer hover:bg-zinc-700/80 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-zinc-600"
      >
        <option value="rizline">Rizline</option>
        <option value="musedash">Muse Dash</option>
        <option value="osu">OSU</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GameMode, StatusType } from '../types'

interface Props {
  status: string
  statusType: StatusType
  currentMode: GameMode
}

interface Emits {
  (e: 'keyPress', key: string): void
  (e: 'modeChange', mode: GameMode): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedMode = ref<GameMode>(props.currentMode)

const functionButtons = [
  { key: 'esc', label: 'ESC' },
  { key: 'enter', label: 'Enter' },
  { key: 'backspace', label: 'Back' },
  { key: 'delete', label: 'Del' },
]

const statusClass = computed(() => {
  const baseClass = 'text-sm font-medium'
  switch (props.statusType) {
    case 'success':
      return `${baseClass} text-emerald-400`
    case 'error':
      return `${baseClass} text-red-400`
    case 'warning':
      return `${baseClass} text-amber-400`
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

// 监听外部模式变化
import { watch } from 'vue'
watch(() => props.currentMode, (newMode) => {
  selectedMode.value = newMode
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>

