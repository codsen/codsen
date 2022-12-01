declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

declare const version: string;
interface Opts {
  ignoreRanges: Range[];
}
declare const defaults: Opts;
declare function splitByW(str: string, opts?: Partial<Opts>): string[];

export { Opts, Range, defaults, splitByW, version };
