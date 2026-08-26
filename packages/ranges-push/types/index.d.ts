type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

declare const version: string;
interface Opts {
  limitToBeAddedWhitespace: boolean | undefined;
  limitLinebreaksCount: number | undefined;
  mergeType: 1 | 2 | "1" | "2" | undefined;
}
interface ResolvedOpts {
  limitToBeAddedWhitespace: boolean;
  limitLinebreaksCount: number;
  mergeType: 1 | 2;
}
declare const defaults: ResolvedOpts;
declare class Ranges {
  constructor(originalOpts?: Partial<Opts>);
  ranges: Range[];
  opts: Readonly<ResolvedOpts>;
  private addValidated;
  add(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string,
  ): void;
  add(originalFrom: Range[] | Range | null): void;
  push(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string,
  ): void;
  push(originalFrom: Range[] | Range | null): void;
  current(): null | Range[];
  firstCovers(index: number): boolean;
  wipe(): void;
  replace(givenRanges: Range[] | null): void;
  last(): Range | null;
}

export { Ranges, defaults, version };
export type { Opts, Range };
