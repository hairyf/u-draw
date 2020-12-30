import DrawPoster from "./draw-poster";
import { DrawPosterBuildOpts } from "./utils/interface";
declare const useDrawPoster: (options: string | DrawPosterBuildOpts) => Promise<DrawPoster>;
declare const useDrawPosters: (optionsAll: (string | DrawPosterBuildOpts)[]) => Promise<{
    [key: string]: DrawPoster;
}>;
export { DrawPoster, useDrawPoster, useDrawPosters };
export default DrawPoster;
