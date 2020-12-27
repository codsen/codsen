import { version } from "../package.json";
import { Range, Ranges as RangesType } from "../../../scripts/common";
interface Opts {
    limitToBeAddedWhitespace?: boolean;
    limitLinebreaksCount?: number;
    mergeType?: 1 | 2 | "1" | "2" | undefined;
}
declare const defaults: Opts;
interface RangesInstance {
    opts: Opts;
    ranges: RangesType;
}
declare class Ranges implements RangesInstance {
    constructor(originalOpts?: Opts);
    ranges: RangesType;
    opts: Opts;
    add(originalFrom: null | number | Range, originalTo: number, addVal?: undefined | null | string): void;
    push(originalFrom: null | number | Range, originalTo: number, addVal: undefined | null | string): void;
    current(): RangesType;
    wipe(): void;
    replace(givenRanges: RangesType): void;
    last(): Range | null;
}
export { Ranges, defaults, version };
