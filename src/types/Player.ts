import type { Gravity } from './Gravity.js'
import type { Controls } from './Controls.js'

export interface Player {
  id: number,
  gravity: Gravity,
  controls: Controls
}

export interface PlayerPosition {
  id: number,
  position: DOMRect
}