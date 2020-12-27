import { version } from "../package.json";
import { Ranges } from "../../../scripts/common";
declare type OffsetValueCb = (amountToOffset: number) => void;
declare type Callback = (fromIdx: number, toIdx: number, offsetValueCb: OffsetValueCb) => void;
declare function rProcessOutside(originalStr: string, originalRanges: Ranges, cb: Callback, skipChecks?: boolean): void;
export { rProcessOutside, version };
