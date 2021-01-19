declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;

interface Opts {
    lineLengthLimit: number;
    removeIndentations: boolean;
    removeLineBreaks: boolean;
    removeHTMLComments: boolean | 0 | 1 | 2;
    removeCSSComments: boolean;
    reportProgressFunc: null | ((percDone: number) => void);
    reportProgressFuncFrom: number;
    reportProgressFuncTo: number;
    breakToTheLeftOf: string[];
    mindTheInlineTags: string[];
}
declare const defaults: Opts;
interface Res {
    log: {
        timeTakenInMilliseconds: number;
        originalLength: number;
        cleanedLength: number;
        bytesSaved: number;
        percentageReducedOfOriginal: number;
    };
    applicableOpts: {
        removeHTMLComments: boolean;
        removeCSSComments: boolean;
    };
    ranges: Ranges;
    result: string;
}
declare function crush(str: string, originalOpts?: Partial<Opts>): Res;

export { crush, defaults, version };
