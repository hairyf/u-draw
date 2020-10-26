/** 是否是base64本地地址 */
export const isBaseUrl = (str) => {
    return /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i.test(str);
};
/** 是否是小程序本地地址 */
export const isTmpUrl = (str) => {
    return /http:\/\/temp\/wx/.test(str);
};
/** 处理构建配置 */
export const handleBuildOpts = (options) => {
    let newOpts = {
        selector: '',
        componentThis: undefined,
        type2d: true
    };
    if (typeof options === "string") {
        newOpts.selector = options;
    }
    else {
        newOpts = Object.assign(Object.assign({}, newOpts), options);
    }
    const oldSelector = newOpts.selector;
    // #ifdef MP-WEIXIN
    if (newOpts.type2d) {
        newOpts.selector = '#' + newOpts.selector;
    }
    // #endif
    // #ifndef APP-PLUS || APP-PLUS-NVUE || H5 || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ || MP-360 || MP || quickapp-webview || quickapp-webview-union || quickapp-webview-huawei
    console.error('注意! draw-poster未开启uni条件编译! 当环境是微信小程序将不会动态切换为type2d模式');
    console.error(`请在vue.config.js中的transpileDependencies中添加'uni-draw-poster'`);
    console.error(`或者可以在选择器字符串前缀中添加#来切换为type2d绘制(不推荐)`);
    newOpts.selector = oldSelector;
    // #endif
    return newOpts;
};
