import { Ranges } from "ranges-merge";
export { Range, Ranges } from "ranges-merge";

declare const version: string;
interface Opts {
  strictlyTwoElementsInRangeArrays: boolean;
  skipChecks: boolean;
}
declare const defaults: Opts;
declare function rInvert(
  arrOfRanges: Ranges,
  strLen: number,
  originalOptions?: Partial<Opts>,
): Ranges;

export { Opts, defaults, rInvert, version };
