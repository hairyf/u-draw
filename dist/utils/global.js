let gbl = null;
const isUni = typeof uni !== "undefined";
const isWx = typeof wx !== "undefined" && !isUni;
if (isUni) {
    gbl = uni;
}
if (isWx) {
    gbl = wx;
}
export default gbl;
