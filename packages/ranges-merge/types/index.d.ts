import { Ranges } from "ranges-sort";
export { Range, Ranges } from "ranges-sort";

declare const version: string;
declare type ProgressFn = (percentageDone: number) => void;
interface Opts {
  mergeType: 1 | 2 | "1" | "2";
  progressFn: null | undefined | ProgressFn;
  joinRangesThatTouchEdges: boolean;
}
declare const defaults: Opts;
declare function rMerge(
  arrOfRanges: Ranges,
  originalOpts?: Partial<Opts>
): Ranges;

export { defaults, rMerge, version };
