declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
interface HeadsAndTailsObj {
    heads: string | string[];
    tails: string | string[];
}
interface Opts {
    removeWidowPreventionMeasures: boolean;
    convertEntities: boolean;
    targetLanguage: "html" | "css" | "js";
    UKPostcodes: boolean;
    hyphens: boolean;
    minWordCount: number;
    minCharCount: number;
    ignore: HeadsAndTailsObj[] | string | string[];
    reportProgressFunc: null | ((percDone: number) => void);
    reportProgressFuncFrom: number;
    reportProgressFuncTo: number;
    tagRanges: Range[] | null;
}
declare const defaults: Opts;
interface Res {
    res: string;
    ranges: Ranges;
    log: {
        timeTakenInMilliseconds: number;
    };
    whatWasDone: {
        removeWidows: boolean;
        convertEntities: boolean;
    };
}
declare function removeWidows(str: string, originalOpts?: Partial<Opts>): Res;

export { defaults, removeWidows, version };
