import { version } from "../package.json";
import { Ranges as RangesType } from "../../../scripts/common";
interface Opts {
    removeWidowPreventionMeasures: boolean;
    convertEntities: boolean;
    targetLanguage: "html" | "css" | "js";
    UKPostcodes: boolean;
    hyphens: boolean;
    minWordCount: number;
    minCharCount: number;
    ignore: {
        heads: string | string[];
        tails: string | string[];
    }[] | string;
    reportProgressFunc: null | ((percDone: number) => void);
    reportProgressFuncFrom: number;
    reportProgressFuncTo: number;
    tagRanges: [from: number, to: number][];
}
declare const defaults: Opts;
interface Res {
    res: string;
    ranges: RangesType;
    log: {
        timeTakenInMilliseconds: number;
    };
    whatWasDone: {
        removeWidows: boolean;
        convertEntities: boolean;
    };
}
declare function removeWidows(str: string, originalOpts?: Opts): Res;
export { removeWidows, defaults, version };
