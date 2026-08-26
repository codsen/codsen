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
declare const defaults: Readonly<ResolvedOpts>;
type AddValue = string | number | null | undefined;
type IndexInput = number | string;
type Range<InsertValue extends AddValue = AddValue> =
  | [from: number, to: number]
  | [from: number, to: number, addValue: InsertValue];
type RangeInput<InsertValue extends AddValue = AddValue> =
  | [from: IndexInput, to: IndexInput]
  | [from: IndexInput, to: IndexInput, addValue: InsertValue];
declare class Ranges<InsertValue extends AddValue = AddValue> {
  constructor(originalOpts?: Partial<Opts>);
  ranges: Range<InsertValue>[] | null;
  opts: Readonly<ResolvedOpts>;
  private currentCache;
  private rangeListsMatch;
  private snapshotRanges;
  private currentStateMatchesSnapshot;
  private recordCurrentSnapshot;
  private invalidateCurrentCache;
  private addValidated;
  add(
    originalFrom: IndexInput,
    originalTo: IndexInput,
    addVal?: InsertValue,
  ): void;
  add(originalFrom?: null, originalTo?: null, addVal?: null): void;
  add(
    originalFrom:
      | RangeInput<InsertValue>[]
      | RangeInput<InsertValue>
      | null
      | undefined,
  ): void;
  push(
    originalFrom: IndexInput,
    originalTo: IndexInput,
    addVal?: InsertValue,
  ): void;
  push(originalFrom?: null, originalTo?: null, addVal?: null): void;
  push(
    originalFrom:
      | RangeInput<InsertValue>[]
      | RangeInput<InsertValue>
      | null
      | undefined,
  ): void;
  current(): null | Range<InsertValue>[];
  firstCovers(index: number): boolean;
  wipe(): void;
  replace(givenRanges: RangeInput<InsertValue>[] | null | undefined): void;
  last(): Range<InsertValue> | null;
}

export { Ranges, defaults, version };
export type { Opts, Range, RangeInput };
