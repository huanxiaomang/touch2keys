import { io, Socket } from 'socket.io-client'
import type {
  TouchEventData,
  TouchFeedbackData,
  ModeUpdateData,
  StatusData,
  ErrorData,
  KeyPressData,
  OsuKeyData,
  GameMode,
} from '../types'

class SocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Set<Function>> = new Map()

  connect() {
    if (this.socket?.connected) return

    this.socket = io()

    // 连接事件
    this.socket.on('connect', () => {
      this.emit('connection', 'connected')
    })

    this.socket.on('disconnect', () => {
      this.emit('connection', 'disconnected')
    })

    // 业务事件
    this.socket.on('status', (data: StatusData) => {
      this.emit('status', data)
    })

    this.socket.on('error', (data: ErrorData) => {
      this.emit('error', data)
    })

    this.socket.on('mode_update', (data: ModeUpdateData) => {
      this.emit('mode_update', data)
    })

    this.socket.on('touch_feedback', (data: TouchFeedbackData) => {
      this.emit('touch_feedback', data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // 发送触摸事件
  sendTouchEvent(data: TouchEventData) {
    this.socket?.emit('touch_event', data)
  }

  // 切换模式
  setMode(mode: GameMode) {
    this.socket?.emit('set_mode', { mode })
  }

  // 发送按键
  sendKeyPress(key: string) {
    this.socket?.emit('key_press', { key })
  }

  // OSU 按键按下
  sendOsuKeyDown(key: string) {
    this.socket?.emit('osu_key_down', { key })
  }

  // OSU 按键释放
  sendOsuKeyUp(key: string) {
    this.socket?.emit('osu_key_up', { key })
  }

  // 事件监听
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  // 移除监听
  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  // 触发事件
  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  // 获取连接状态
  get isConnected() {
    return this.socket?.connected ?? false
  }
}

// 单例模式
export const socketService = new SocketService()

