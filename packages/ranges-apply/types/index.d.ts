export { Range, Ranges } from "ranges-merge";

declare const version: string;
type IndexInput = number | string;
type ReplacementInput = string | number | null | undefined;
type RangeInput =
  | [from: IndexInput, to: IndexInput]
  | [from: IndexInput, to: IndexInput, whatToInsert: ReplacementInput];
type RangesInput = RangeInput | (RangeInput | null)[] | null;
type ProgressFn = (percentageDone: number) => void;
type ProgressInput = false | null | undefined | 0 | "" | ProgressFn;
declare function rApply(
  str: string,
  originalRangesArr: RangesInput,
  progressFn?: ProgressInput,
): string;

export { rApply, version };
export type { ProgressFn, ProgressInput, RangeInput, RangesInput };
