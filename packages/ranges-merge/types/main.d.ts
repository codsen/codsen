import { version } from "../package.json";
import { Ranges } from "../../../scripts/common";
declare type ProgressFn = (percentageDone: number) => void;
interface Opts {
    mergeType?: 1 | 2 | "1" | "2";
    progressFn?: null | undefined | ProgressFn;
    joinRangesThatTouchEdges?: boolean;
}
declare const defaults: Opts;
declare function rMerge(arrOfRanges: Ranges, originalOpts?: Opts): Ranges;
export { rMerge, defaults, version };
