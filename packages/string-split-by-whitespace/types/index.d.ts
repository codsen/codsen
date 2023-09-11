type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

declare const version: string;
interface Opts {
  ignoreRanges: Range[];
}
declare const defaults: Opts;
declare function splitByW(str: string, opts?: Partial<Opts>): string[];

export { type Opts, type Range, defaults, splitByW, version };
