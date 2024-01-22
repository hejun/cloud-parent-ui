export function randomString(length: number = 6) {
  const seed: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'
  let str = ''
  for (let i = 0; i < length; i++) {
    const index = Math.ceil(Math.random() * seed.length)
    str += seed[index]
  }
  return str
}
