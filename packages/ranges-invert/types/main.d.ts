declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
interface Opts {
    strictlyTwoElementsInRangeArrays?: boolean;
    skipChecks?: boolean;
}
declare function rInvert(arrOfRanges: Ranges, strLen: number, originalOptions?: Opts): Ranges;

export { rInvert, version };
