import { DrawPosterUseCtxOpts } from '../../utils/interface';
import { ObjectFit, ObjectPosition, Size } from "../../utils/object-sizing";
export interface DrawImageFitOpts {
    round?: number;
    objectFit?: ObjectFit;
    intrinsicSize?: Size;
    specifiedSize?: Size;
    intrinsicPosition?: ObjectPosition;
    specifiedPosition?: [number, number];
}
declare const _default: DrawPosterUseCtxOpts;
export default _default;
