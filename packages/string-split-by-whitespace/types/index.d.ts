declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

declare const version: string;
interface Opts {
  ignoreRanges: Range[];
}
declare function splitByW(str: string, originalOpts?: Partial<Opts>): string[];

export { splitByW, version };
