import { DrawPosterBuildOpts } from "./interface";
/** 是否是base64本地地址 */
export declare const isBaseUrl: (str: string) => boolean;
/** 是否是小程序本地地址 */
export declare const isTmpUrl: (str: string) => boolean;
/** 是否是网络地址 */
export declare const isNetworkUrl: (str: string) => boolean;
/** 处理构建配置 */
export declare const handleBuildOpts: (options: string | DrawPosterBuildOpts) => {
    selector: string;
    componentThis: undefined;
    type2d: boolean;
    loading: boolean;
    drawImageTime: number;
    debugging: boolean;
    loadingText: string;
    createText: string;
};
