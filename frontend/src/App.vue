<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TopBar from './components/TopBar.vue'
import TouchCanvas from './components/TouchCanvas.vue'
import OsuOverlay from './components/OsuOverlay.vue'
import TouchFeedback from './components/TouchFeedback.vue'
import { socketService } from './services/socket'
import type {
  GameMode,
  StatusType,
  TouchEventType,
  OsuKey,
  TouchFeedbackData,
  ModeUpdateData,
  StatusData,
  ErrorData,
} from './types'

// 状态管理
const currentMode = ref<GameMode>('rizline')
const statusText = ref('连接中...')
const statusType = ref<StatusType>('info')
const touchFeedbackRef = ref<InstanceType<typeof TouchFeedback> | null>(null)
const topBarHeight = ref(60)

// 处理触摸事件
const handleTouch = (type: TouchEventType, touch: Touch, x: number, y: number) => {
  socketService.sendTouchEvent({
    type,
    id: touch.identifier,
    ts: Date.now(),
    x_percent: x,
    y_percent: y,
  })
}

// 处理按键
const handleKeyPress = (key: string) => {
  socketService.sendKeyPress(key)
}

// 处理模式切换
const handleModeChange = (mode: GameMode) => {
  socketService.setMode(mode)
}

// 处理顶栏高度变化
const handleHeightChange = (height: number) => {
  topBarHeight.value = height
}

// 处理 OSU 按键
const handleOsuKeyDown = (key: OsuKey) => {
  socketService.sendOsuKeyDown(key)
}

const handleOsuKeyUp = (key: OsuKey) => {
  socketService.sendOsuKeyUp(key)
}

// Socket 事件监听
const onConnection = (status: string) => {
  if (status === 'connected') {
    statusText.value = '✓ 已连接'
    statusType.value = 'success'
  } else {
    statusText.value = '✗ 连接断开'
    statusType.value = 'error'
  }
}

const onStatus = (data: StatusData) => {
  statusText.value = data.message
  statusType.value = 'info'
}

const onError = (data: ErrorData) => {
  statusText.value = `⚠ ${data.message}`
  statusType.value = 'warning'

  setTimeout(() => {
    statusText.value = `模式: ${currentMode.value}`
    statusType.value = 'info'
  }, 2000)
}

const onModeUpdate = (data: ModeUpdateData) => {
  currentMode.value = data.mode
  statusText.value = `模式: ${data.mode}`
  statusType.value = 'info'
}

const onTouchFeedback = (data: TouchFeedbackData) => {
  touchFeedbackRef.value?.addDot(data)
}

onMounted(() => {
  // 连接 Socket
  socketService.connect()

  // 注册事件监听
  socketService.on('connection', onConnection)
  socketService.on('status', onStatus)
  socketService.on('error', onError)
  socketService.on('mode_update', onModeUpdate)
  socketService.on('touch_feedback', onTouchFeedback)
})

onUnmounted(() => {
  // 移除事件监听
  socketService.off('connection', onConnection)
  socketService.off('status', onStatus)
  socketService.off('error', onError)
  socketService.off('mode_update', onModeUpdate)
  socketService.off('touch_feedback', onTouchFeedback)

  // 断开连接
  socketService.disconnect()
})
</script>

<template>
  <div class="relative bg-gradient-to-br from-[#0a0a0a] via-[#0f0a14] to-[#0a0a0a] text-white overflow-hidden w-screen h-screen">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 opacity-30 pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <!-- 顶部控制栏 -->
    <TopBar
      :status="statusText"
      :status-type="statusType"
      :current-mode="currentMode"
      @key-press="handleKeyPress"
      @mode-change="handleModeChange"
      @height-change="handleHeightChange"
    />

    <!-- 触控画布 -->
    <TouchCanvas
      :disabled="currentMode === 'osu'"
      @touch="handleTouch"
    />

    <!-- OSU 模式覆盖层 -->
    <OsuOverlay
      :active="currentMode === 'osu'"
      @key-down="handleOsuKeyDown"
      @key-up="handleOsuKeyUp"
    />

    <!-- 触摸反馈 -->
    <TouchFeedback
      ref="touchFeedbackRef"
      :current-mode="currentMode"
    />
  </div>
</template>

<style scoped>
/* 组件样式已在各自组件中定义 */
</style>
