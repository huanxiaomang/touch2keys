// 游戏模式类型
export type GameMode = 'rizline' | 'musedash' | 'osu'

// OSU 按键类型
export type OsuKey = 'd' | 'f' | 'j' | 'k'

// 触摸事件类型
export type TouchEventType = 'down' | 'up' | 'cancel'

// 触摸侧边（Muse Dash 模式）
export type TouchSide = 'left' | 'right'

// Socket 事件数据类型
export interface TouchEventData {
  type: TouchEventType
  id: number
  ts: number
  x_percent: number
  y_percent: number
}

export interface TouchFeedbackData {
  id: number
  key: string
  side?: TouchSide
  x_percent: number
  y_percent: number
}

export interface ModeUpdateData {
  mode: GameMode
}

export interface StatusData {
  message: string
}

export interface ErrorData {
  message: string
}

export interface KeyPressData {
  key: string
}

export interface OsuKeyData {
  key: OsuKey
}

// OSU 按键状态
export interface OsuKeyStates {
  d: boolean
  f: boolean
  j: boolean
  k: boolean
}

export interface OsuKeyTouchIds {
  d: number | null
  f: number | null
  j: number | null
  k: number | null
}

// 连接状态
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

// 状态消息类型
export type StatusType = 'success' | 'error' | 'info' | 'warning'

export interface StatusMessage {
  text: string
  type: StatusType
}

