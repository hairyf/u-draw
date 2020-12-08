const ctx = {
  font: '800 16px sans-serif',
  callback: (a: number, b: number, c: number) => {

  }
}


const toSize = (str: string, size: number = 2) => {
  return str.replace(/(\d*)px/g, (rgxStr) => (parseInt(rgxStr) * size) + 'px')
}

const defineCtx = <T>(object: T, key: keyof T, value: any) => {
  Object.defineProperty(object, key, {
    get: () => {
      return value
    },
    set: (newVal: string) => {
      value = toSize(newVal, 2)
      return value
    }
  })
}

defineCtx(ctx, 'font', ctx.font)

// const font = ctx.font = '800 16px sans-serif'
// console.log(font)
defineCtx(ctx, 'callback', ctx.callback)
ctx.callback(1,2,3)