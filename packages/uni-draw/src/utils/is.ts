export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

export function isObject(value: any): value is object {
  return typeof value === 'object'
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}
