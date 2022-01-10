declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
interface Result {
  res: string[];
  ranges: Ranges;
}
/**
 * Extracts CSS class/id names from a string
 */
declare function extract(str: string): Result;

export { extract, version };
