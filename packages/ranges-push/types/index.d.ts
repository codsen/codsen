type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

declare const version: string;
interface Opts {
  limitToBeAddedWhitespace: boolean;
  limitLinebreaksCount: number;
  mergeType: 1 | 2 | "1" | "2" | undefined;
}
declare const defaults: Opts;
declare class Ranges {
  constructor(originalOpts?: Partial<Opts>);
  ranges: Range[];
  opts: Opts;
  add(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string
  ): void;
  add(originalFrom: Range[] | Range | null): void;
  push(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string
  ): void;
  push(originalFrom: Range[] | Range | null): void;
  current(): null | Range[];
  wipe(): void;
  replace(givenRanges: Range[]): void;
  last(): Range | null;
}

export { Opts, Range, Ranges, defaults, version };
