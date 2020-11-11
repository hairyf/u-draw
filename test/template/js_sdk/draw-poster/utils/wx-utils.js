import gbl from "./global";
import { isBaseUrl, isNetworkUrl, isTmpUrl } from './utils';
// 下载指定地址图片, 如果不符合下载图片, 则直接返回
export const downloadImgUrl = (url) => new Promise((resolve, reject) => {
    if (isBaseUrl(url) || isTmpUrl(url) || !isNetworkUrl(url)) {
        resolve(url);
        return;
    }
    gbl.downloadFile({
        url,
        success: (res) => resolve(res.tempFilePath),
        fail: reject
    });
});
// 获取当前指定 node 节点
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
