export interface Distance {
  x: number,
  y: number
}
export interface CurrentMovement {
  left: number | undefined,
  right: number | undefined,
  up: number | undefined,
  down: number | undefined
}
export type HorizontalDirection = 'left' | 'right' | null