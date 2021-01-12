import { version } from "../package.json";
import { Range, Ranges as RangesType } from "../../../scripts/common";
interface Extras {
    whiteSpaceStartsAt: null | number;
    whiteSpaceEndsAt: null | number;
    str: string;
}
interface CbObj extends Extras {
    suggested: Range;
}
declare type Callback = (cbObj: CbObj) => any;
interface Opts {
    trimStart: boolean;
    trimEnd: boolean;
    trimLines: boolean;
    trimnbsp: boolean;
    removeEmptyLines: boolean;
    limitConsecutiveEmptyLinesTo: number;
    enforceSpacesOnly: boolean;
    cb: Callback;
}
declare const defaults: Opts;
interface Res {
    result: string;
    ranges: RangesType;
}
declare const cbSchema: string[];
declare function collapse(str: string, originalOpts?: Partial<Opts>): Res;
export { collapse, cbSchema, defaults, version };
