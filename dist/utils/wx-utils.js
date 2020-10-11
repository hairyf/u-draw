import gbl from "./global";
// 下载图片方法
export const downloadImgUrl = (url) => new Promise((resolve, reject) => {
    gbl.downloadFile({
        url,
        success: (res) => resolve(res.tempFilePath),
        fail: reject
    });
});
// 获取node节点
export const getCanvas2dContext = (selector, componentsThis) => {
    return new Promise(resolve => {
        const query = (componentsThis ?
            gbl.createSelectorQuery().in(componentsThis) :
            gbl.createSelectorQuery());
        query.select(selector)
            .fields({ node: true }, res => {
            const node = res === null || res === void 0 ? void 0 : res.node;
            resolve(node);
        }).exec();
    });
};
