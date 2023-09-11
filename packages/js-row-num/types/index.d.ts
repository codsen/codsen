type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;

interface Opts {
  padStart: number;
  overrideRowNum: null | number;
  triggerKeywords: string[];
  extractedLogContentsWereGiven: boolean;
}
declare const defaults: Opts;
interface Res {
  log: {
    timeTakenInMilliseconds: number;
  };
  result: string;
  ranges: Ranges;
}
declare function fixRowNums(str: string, opts?: Partial<Opts>): Res;

export { type Opts, type Ranges, type Res, defaults, fixRowNums, version };
