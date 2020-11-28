import DrawPoster from "./draw-poster";
import DrawAnimation from "./draw-animation";
import { DrawPosterBuildOpts } from "./utils/interface";
declare const useDrawPoster: (options: string | DrawPosterBuildOpts) => Promise<DrawPoster>;
declare const useDrawPosters: (optionsAll: (string | DrawPosterBuildOpts)[]) => Promise<{
    [key: string]: DrawPoster;
}>;
export { DrawPoster, DrawAnimation, useDrawPoster, useDrawPosters };
export default DrawPoster;
