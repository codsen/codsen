import { Ranges } from "../../../scripts/common";
import { version } from "../package.json";
interface Opts {
    strictlyTwoElementsInRangeArrays?: boolean;
    skipChecks?: boolean;
}
declare function rInvert(arrOfRanges: Ranges, strLen: number, originalOptions?: Opts): Ranges;
export { rInvert, version };
