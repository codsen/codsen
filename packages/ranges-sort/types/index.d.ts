type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;
declare const version: string;
type ProgressFn = (percentageDone: number) => void;
interface Opts {
  strictlyTwoElementsInRangeArrays: boolean;
  progressFn: undefined | null | ProgressFn;
}
declare const defaults: Opts;
declare function rSort(
  arrOfRanges: Ranges,
  originalOptions?: Partial<Opts>,
): Ranges;

export {
  type Opts,
  type ProgressFn,
  type Range,
  type Ranges,
  defaults,
  rSort,
  version,
};
