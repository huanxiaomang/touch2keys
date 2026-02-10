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
      v-for="(key, index) in osuKeys"
      :key="key"
      :data-key="key"
      class="osu-zone"
      :class="[
        { pressed: keyStates[key] },
        getZoneColorClass(index)
      ]"
    >
      <!-- 背景装饰 -->
      <div class="zone-bg"></div>

      <!-- 按压波纹效果 -->
      <div v-if="keyStates[key]" class="ripple"></div>

      <!-- 按键标签 -->
      <div class="osu-zone-label">
        <span class="label-text">{{ key.toUpperCase() }}</span>
        <span class="label-hint">{{ getKeyHint(index) }}</span>
      </div>

      <!-- 边框光效 -->
      <div class="zone-glow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
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

// 获取区域颜色类
const getZoneColorClass = (index: number) => {
  const colors = ['zone-violet', 'zone-fuchsia', 'zone-pink', 'zone-rose']
  return colors[index]
}

// 获取按键提示
const getKeyHint = (index: number) => {
  const hints = ['左上', '左下', '右上', '右下']
  return hints[index]
}

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
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%);
  pointer-events: auto;
}

.osu-zone {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(10px);
}

/* 背景装饰 */
.zone-bg {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

/* 不同区域的颜色主题 */
.zone-violet .zone-bg {
  background: radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
}

.zone-fuchsia .zone-bg {
  background: radial-gradient(circle at 70% 30%, rgba(217, 70, 239, 0.15) 0%, transparent 70%);
}

.zone-pink .zone-bg {
  background: radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
}

.zone-rose .zone-bg {
  background: radial-gradient(circle at 70% 70%, rgba(251, 113, 133, 0.15) 0%, transparent 70%);
}

.osu-zone:hover .zone-bg {
  opacity: 1;
}

/* 边框光效 */
.zone-glow {
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  pointer-events: none;
}

.zone-violet .zone-glow {
  border-color: rgba(139, 92, 246, 0.2);
}

.zone-fuchsia .zone-glow {
  border-color: rgba(217, 70, 239, 0.2);
}

.zone-pink .zone-glow {
  border-color: rgba(236, 72, 153, 0.2);
}

.zone-rose .zone-glow {
  border-color: rgba(251, 113, 133, 0.2);
}

.osu-zone:hover .zone-glow {
  border-width: 3px;
}

.zone-violet:hover .zone-glow {
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: inset 0 0 30px rgba(139, 92, 246, 0.1), 0 0 20px rgba(139, 92, 246, 0.2);
}

.zone-fuchsia:hover .zone-glow {
  border-color: rgba(217, 70, 239, 0.5);
  box-shadow: inset 0 0 30px rgba(217, 70, 239, 0.1), 0 0 20px rgba(217, 70, 239, 0.2);
}

.zone-pink:hover .zone-glow {
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow: inset 0 0 30px rgba(236, 72, 153, 0.1), 0 0 20px rgba(236, 72, 153, 0.2);
}

.zone-rose:hover .zone-glow {
  border-color: rgba(251, 113, 133, 0.5);
  box-shadow: inset 0 0 30px rgba(251, 113, 133, 0.1), 0 0 20px rgba(251, 113, 133, 0.2);
}

/* 按压状态 */
.osu-zone.pressed {
  transform: scale(0.98);
}

.zone-violet.pressed .zone-bg {
  opacity: 1;
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%);
}

.zone-fuchsia.pressed .zone-bg {
  opacity: 1;
  background: radial-gradient(circle at center, rgba(217, 70, 239, 0.3) 0%, rgba(217, 70, 239, 0.1) 50%, transparent 100%);
}

.zone-pink.pressed .zone-bg {
  opacity: 1;
  background: radial-gradient(circle at center, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.1) 50%, transparent 100%);
}

.zone-rose.pressed .zone-bg {
  opacity: 1;
  background: radial-gradient(circle at center, rgba(251, 113, 133, 0.3) 0%, rgba(251, 113, 133, 0.1) 50%, transparent 100%);
}

.zone-violet.pressed .zone-glow {
  border-color: rgba(139, 92, 246, 0.8);
  border-width: 4px;
  box-shadow: inset 0 0 50px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.4);
}

.zone-fuchsia.pressed .zone-glow {
  border-color: rgba(217, 70, 239, 0.8);
  border-width: 4px;
  box-shadow: inset 0 0 50px rgba(217, 70, 239, 0.3), 0 0 40px rgba(217, 70, 239, 0.4);
}

.zone-pink.pressed .zone-glow {
  border-color: rgba(236, 72, 153, 0.8);
  border-width: 4px;
  box-shadow: inset 0 0 50px rgba(236, 72, 153, 0.3), 0 0 40px rgba(236, 72, 153, 0.4);
}

.zone-rose.pressed .zone-glow {
  border-color: rgba(251, 113, 133, 0.8);
  border-width: 4px;
  box-shadow: inset 0 0 50px rgba(251, 113, 133, 0.3), 0 0 40px rgba(251, 113, 133, 0.4);
}

/* 波纹效果 */
@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

.ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  pointer-events: none;
  animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.zone-violet .ripple {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%);
}

.zone-fuchsia .ripple {
  background: radial-gradient(circle, rgba(217, 70, 239, 0.6) 0%, transparent 70%);
}

.zone-pink .ripple {
  background: radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%);
}

.zone-rose .ripple {
  background: radial-gradient(circle, rgba(251, 113, 133, 0.6) 0%, transparent 70%);
}

/* 按键标签 */
.osu-zone-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.label-text {
  font-size: 72px;
  font-weight: 900;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.label-hint {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.osu-zone:hover .label-text {
  color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.osu-zone:hover .label-hint {
  color: rgba(255, 255, 255, 0.5);
}

.zone-violet.pressed .label-text {
  color: rgba(139, 92, 246, 0.9);
  text-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4);
  transform: scale(1.1);
}

.zone-fuchsia.pressed .label-text {
  color: rgba(217, 70, 239, 0.9);
  text-shadow: 0 0 30px rgba(217, 70, 239, 0.8), 0 0 60px rgba(217, 70, 239, 0.4);
  transform: scale(1.1);
}

.zone-pink.pressed .label-text {
  color: rgba(236, 72, 153, 0.9);
  text-shadow: 0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(236, 72, 153, 0.4);
  transform: scale(1.1);
}

.zone-rose.pressed .label-text {
  color: rgba(251, 113, 133, 0.9);
  text-shadow: 0 0 30px rgba(251, 113, 133, 0.8), 0 0 60px rgba(251, 113, 133, 0.4);
  transform: scale(1.1);
}

.osu-zone.pressed .label-hint {
  color: rgba(255, 255, 255, 0.8);
  transform: translateY(-5px);
}
</style>

