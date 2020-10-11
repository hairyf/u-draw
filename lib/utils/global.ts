let gbl: UniApp.Uni = null as any;

const isUni = typeof uni !== "undefined"
const isWx = typeof wx !== "undefined" && !isUni
if (isUni) {
  gbl = uni as any
}
if (isWx) {
  gbl = wx as any
}
export default gbl