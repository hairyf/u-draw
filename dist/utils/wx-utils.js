import gbl from "./global";
import { isBaseUrl, isTmpUrl } from './utils';
// 下载图片方法
export const downloadImgUrl = (url) => new Promise((resolve, reject) => {
    if (isBaseUrl(url) || isTmpUrl(url)) {
        resolve(url);
        return;
    }
    gbl.downloadFile({
        url,
        success: (res) => resolve(res.tempFilePath),
        fail: reject
    });
});
// 获取node节点
export const getCanvas2dContext = (selector, componentThis) => {
    return new Promise(resolve => {
        const query = (componentThis ?
            gbl.createSelectorQuery().in(componentThis) :
            gbl.createSelectorQuery());
        query.select(selector)
            .fields({ node: true }, res => {
            const node = res === null || res === void 0 ? void 0 : res.node;
            resolve(node || {});
        }).exec();
    });
};
