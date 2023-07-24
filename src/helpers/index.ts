export const getRandomFrom = <T>(options: T[]): T => {
  const index = Math.round(Math.random() * (options.length - 1))
  return options[index]
}