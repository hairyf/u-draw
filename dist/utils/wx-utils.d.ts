import { Canvas } from "./interface";
export declare const downloadImgUrl: (url: string) => Promise<string>;
export declare const getCanvas2dContext: (selector: string, componentsThis?: any) => Promise<Canvas | undefined>;
