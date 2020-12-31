import { version } from "../package.json";
import { Ranges as RangesType } from "../../../scripts/common";
interface Opts {
    padStart?: number;
    overrideRowNum?: null | number;
    returnRangesOnly?: boolean;
    triggerKeywords?: string[];
    extractedLogContentsWereGiven?: boolean;
}
declare const defaults: Opts;
declare function fixRowNums(str: string, originalOpts?: Opts): string | RangesType;
export { fixRowNums, defaults, version };
