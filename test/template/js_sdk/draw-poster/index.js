var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DrawPoster from "./draw-poster";
import DrawAnimation from "./draw-animation";
import * as dfucs from "./extends/draw-function";
DrawPoster.useCtx(dfucs.drawImage);
DrawPoster.useCtx(dfucs.fillWarpText);
DrawPoster.useCtx(dfucs.roundRect);
DrawPoster.useCtx(dfucs.fillRoundRect);
DrawPoster.useCtx(dfucs.strokeRoundRect);
DrawPoster.useCtx(dfucs.drawRoundImage);
const useDrawPoster = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const dp = yield DrawPoster.build(options);
    return dp;
});
const useDrawPosters = (optionsAll) => __awaiter(void 0, void 0, void 0, function* () {
    const dps = yield DrawPoster.buildAll(optionsAll);
    return dps;
});
export { DrawPoster, DrawAnimation, useDrawPoster, useDrawPosters };
export default DrawPoster;
