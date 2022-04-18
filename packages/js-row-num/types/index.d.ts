declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
interface Opts {
  padStart: number;
  overrideRowNum: null | number;
  returnRangesOnly: boolean;
  triggerKeywords: string[];
  extractedLogContentsWereGiven: boolean;
}
declare const defaults: Opts;
declare function fixRowNums(str: string, opts?: Partial<Opts>): string | Ranges;

export { defaults, fixRowNums, version };
