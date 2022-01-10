import { Ranges } from "ranges-merge";
export { Range, Ranges } from "ranges-merge";

declare const version: string;
declare function rApply(
  str: string,
  originalRangesArr: Ranges,
  progressFn?: (percentageDone: number) => void
): string;

export { rApply, version };
