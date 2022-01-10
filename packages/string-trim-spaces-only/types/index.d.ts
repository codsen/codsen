declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
interface Opts {
  classicTrim: boolean;
  cr: boolean;
  lf: boolean;
  tab: boolean;
  space: boolean;
  nbsp: boolean;
}
declare const defaults: Opts;
interface Res {
  res: string;
  ranges: Ranges;
}
declare function trimSpaces(str: string, originalOpts?: Partial<Opts>): Res;

export { defaults, trimSpaces, version };
