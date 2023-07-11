export interface MovementValues {
  x: number,
  y: number
}
export interface CurrentMovement {
  left: number | undefined,
  right: number | undefined,
  up: number | undefined,
  down: number | undefined
}
export type Direction = 'left' | 'right' | 'up' | 'down' | null