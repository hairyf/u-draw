let gbl = undefined;
const ENV_UNI = typeof uni !== "undefined";
const ENV_WX = typeof wx !== "undefined" && !ENV_UNI;
if (ENV_UNI) {
    gbl = uni;
}
if (ENV_WX) {
    gbl = wx;
}
export { ENV_UNI, ENV_WX };
export default gbl;
