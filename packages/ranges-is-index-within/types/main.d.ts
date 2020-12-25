import { version } from "../package.json";
import { Range, Ranges } from "../../../scripts/common";
interface Opts {
    inclusiveRangeEnds?: boolean;
    returnMatchedRangeInsteadOfTrue?: boolean;
}
declare const defaults: Opts;
declare function isIndexWithin(originalIndex: number, rangesArr: Ranges, originalOpts?: Opts): boolean | Range;
export { isIndexWithin, defaults, version };
