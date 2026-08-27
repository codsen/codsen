type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

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
  ranges: Range[];
}
declare function trimSpaces(str: string, opts?: Partial<Opts>): Res;

export { defaults, trimSpaces, version };
export type { Opts, Res };
