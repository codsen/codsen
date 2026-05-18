import { Range, Ranges } from "ranges-merge";
export { Range, Ranges } from "ranges-merge";

declare const version: string;
type RangesInput = Range | Ranges;
declare function rApply(
  str: string,
  originalRangesArr: RangesInput,
  progressFn?: null | false | 0 | ((percentageDone: number) => void),
): string;

export { rApply, version };
export type { RangesInput };
