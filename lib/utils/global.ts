let gbl: UniApp.Uni = undefined as any;
const ENV_UNI = typeof uni !== "undefined"
const ENV_WX = typeof wx !== "undefined" && !ENV_UNI
if (ENV_UNI) {
  gbl = uni as any
}
if (ENV_WX) {
  gbl = wx as any
}

export {
  ENV_UNI,
  ENV_WX
}
export default gbl