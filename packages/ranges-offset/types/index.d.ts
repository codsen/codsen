type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
declare function rOffset(arrOfRanges: Ranges, offset?: number): Ranges;

export { type Ranges, rOffset, version };
