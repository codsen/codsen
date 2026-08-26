type Range =
  | [from: number, to: number]
  | [
      from: number,
      to: number,
      whatToInsert: string | number | null | undefined,
    ];
type Ranges = Range[] | null;
declare const version: string;
type ProgressFn = (percentageDone: number) => void;
interface Opts {
  strictlyTwoElementsInRangeArrays: boolean;
  /**
   * Reports best-effort integer progress for successful nonempty sorts. The
   * final call is 100. Empty inputs and validation failures do not call it.
   */
  progressFn: undefined | null | ProgressFn;
}
declare const defaults: Opts;
declare function rSort(
  arrOfRanges: Ranges,
  originalOptions?: Partial<Opts>,
): Ranges;

export { defaults, rSort, version };
export type { Opts, ProgressFn, Range, Ranges };
