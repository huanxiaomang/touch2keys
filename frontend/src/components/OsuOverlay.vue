<template>
  <div
    v-if="active"
    ref="overlayRef"
    class="osu-overlay"
    @touchstart.prevent="handleTouchStart"
    @touchend.prevent="handleTouchEnd"
    @touchcancel.prevent="handleTouchCancel"
  >
    <div
      v-for="key in osuKeys"
      :key="key"
      :data-key="key"
      class="osu-zone"
      :class="{ pressed: keyStates[key] }"
    >
      <div class="osu-zone-label">{{ key.toUpperCase() }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { OsuKey, OsuKeyStates, OsuKeyTouchIds } from '../types'

interface Props {
  active: boolean
}

interface Emits {
  (e: 'keyDown', key: OsuKey): void
  (e: 'keyUp', key: OsuKey): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const overlayRef = ref<HTMLDivElement | null>(null)

const osuKeys: OsuKey[] = ['d', 'f', 'j', 'k']

const keyStates = reactive<OsuKeyStates>({
  d: false,
  f: false,
  j: false,
  k: false,
})

const keyTouchIds = reactive<OsuKeyTouchIds>({
  d: null,
  f: null,
  j: null,
  k: null,
})

const handleTouchStart = (e: TouchEvent) => {
  for (const touch of Array.from(e.changedTouches)) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!element || !element.classList.contains('osu-zone')) {
      continue
    }

    const key = element.getAttribute('data-key') as OsuKey
    if (!key) continue

    // 如果这个按键已经被按下，忽略新的触摸
    if (keyStates[key]) {
      continue
    }

    // 记录这个按键对应的 touch ID
    keyTouchIds[key] = touch.identifier
    keyStates[key] = true
    emit('keyDown', key)
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  for (const touch of Array.from(e.changedTouches)) {
    // 检查这个 touch ID 是否对应某个按键
    for (const key of osuKeys) {
      if (keyTouchIds[key] === touch.identifier) {
        // 这是有效的 touch，释放按键
        keyStates[key] = false
        keyTouchIds[key] = null
        emit('keyUp', key)
        break
      }
    }
  }
}

const handleTouchCancel = (e: TouchEvent) => {
  handleTouchEnd(e)
}

// 当组件变为非激活状态时，释放所有按键
watch(() => props.active, (isActive) => {
  if (!isActive) {
    for (const key of osuKeys) {
      if (keyStates[key]) {
        keyStates[key] = false
        keyTouchIds[key] = null
        emit('keyUp', key)
      }
    }
  }
})
</script>

<style scoped>
.osu-overlay {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  pointer-events: auto;
}

.osu-zone {
  position: relative;
  cursor: pointer;
  transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(120, 119, 198, 0.2);
}

.osu-zone:hover {
  background-color: rgba(120, 119, 198, 0.08);
}

.osu-zone.pressed {
  background-color: rgba(120, 119, 198, 0.15);
  border-color: rgba(120, 119, 198, 0.4);
}

.osu-zone-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  color: rgba(168, 85, 247, 0.4);
  pointer-events: none;
  user-select: none;
}

.osu-zone.pressed .osu-zone-label {
  color: rgba(168, 85, 247, 0.8);
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
}
</style>

