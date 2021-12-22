import { Ranges } from 'ranges-merge';

declare const version: string;
interface Opts {
    strictlyTwoElementsInRangeArrays?: boolean;
    skipChecks?: boolean;
}
declare function rInvert(arrOfRanges: Ranges, strLen: number, originalOptions?: Opts): Ranges;

export { rInvert, version };
