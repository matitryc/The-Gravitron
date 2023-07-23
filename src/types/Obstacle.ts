export type ObstacleRow = 0 | 1 | 2 | 3 | 4 | 5

export interface Obstacle {
  id: number
  row: ObstacleRow
  spawnTime: number
  direction: 'left' | 'right'
  visible: boolean
}