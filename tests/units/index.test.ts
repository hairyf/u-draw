const canvas = {
  width: 100,
  height: 100
}


const ctx = {
  font: '800 16px sans-serif',
  callback: (a: number, b: number, c: number) => {
    console.log({ a, b, c })
  }
}

const toSize = (val: string | number, size: number = 2) => {
  if (typeof val === 'string')
    return val.replace(/(\d*)px/g, (rgxStr) => (parseInt(rgxStr) * size) + 'px')
  if (typeof val === 'number')
    return val * size
}

const defineCanvas = <T>(object: T, key: keyof T, value: any) => {
  const _canvas = {
    width: 100,
    height: 100
  }
  Object.defineProperty(_canvas, key, {
    get: () => {
      return value
    },
    set: (newVal: string) => {
      object[key as string] = toSize(newVal, 2)
      value = newVal
    }
  })
  _canvas[key as string] = object[key]
  return _canvas
}

const defineCtx = <T>(object: T, key: keyof T, value: any) => {
  Object.defineProperty(object, key, {
    get: () => {
      return value
    },
    set: (newVal: string) => {
      value = toSize(newVal, 2)
    }
  })
}

const defineCtxCallBack = <T>(object: T, key: keyof T) => {
  object[key] = new Proxy(object[key] as any, {
    apply(target, thisArg, args) {
      args = args.map((num: number) => toSize(num))
      return target.call(thisArg, ...args)
    },
  })
}


defineCtx(ctx, 'font', ctx.font)
defineCtxCallBack(ctx, 'callback')

const _canvas = defineCanvas(canvas, 'width', canvas.width)
// _canvas.width = 100
console.log(_canvas.width, canvas.width)
// ctx.callback(1, 2, 3)