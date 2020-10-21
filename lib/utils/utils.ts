export const isBaseUrl = (str: string) => {
  return /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i.test(str)
}
export const isTmpUrl = (str: string) => {
  return /http:\/\/temp\/wx/.test(str)
}