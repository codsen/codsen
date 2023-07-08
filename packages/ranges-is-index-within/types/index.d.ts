type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Opts {
  inclusiveRangeEnds: boolean;
  returnMatchedRangeInsteadOfTrue: boolean;
}
declare const defaults: Opts;
declare function isIndexWithin(
  index: number,
  rangesArr: Ranges,
  opts?: Partial<Opts>,
): boolean | Range;

export { Opts, Range, Ranges, defaults, isIndexWithin, version };
