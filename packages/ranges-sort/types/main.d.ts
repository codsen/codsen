import { version } from "../package.json";
import { Ranges } from "../../../scripts/common";
declare type Callback = (percentage: number) => void;
interface Opts {
    strictlyTwoElementsInRangeArrays?: boolean;
    progressFn?: undefined | null | Callback;
}
declare const defaults: Opts;
declare function rSort(arrOfRanges: Ranges, originalOptions?: Opts): Ranges;
export { rSort, defaults, version };
