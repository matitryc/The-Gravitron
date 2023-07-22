import { Interval } from './Interval.js'
export interface CurrentMovement {
  left: Interval,
  right: Interval,
  up: Interval,
  down: Interval
}
export type HorizontalDirection = 'left' | 'right' | null