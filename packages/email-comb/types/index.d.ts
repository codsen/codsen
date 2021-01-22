interface Obj {
    [key: string]: any;
}

declare const version: string;

interface HeadsAndTailsObj {
    heads: string;
    tails: string;
}
interface Opts {
    whitelist: string[];
    backend: HeadsAndTailsObj[];
    uglify: boolean;
    removeHTMLComments: boolean;
    removeCSSComments: boolean;
    doNotRemoveHTMLCommentsWhoseOpeningTagContains: string[];
    reportProgressFunc: null | ((percDone: number) => void);
    reportProgressFuncFrom: number;
    reportProgressFuncTo: number;
}
interface Res {
    log: {
        timeTakenInMilliseconds: number;
        traversedTotalCharacters: number;
        traversedTimesInputLength: number;
        originalLength: number;
        cleanedLength: number;
        bytesSaved: number;
        percentageReducedOfOriginal: number;
        nonIndentationsWhitespaceLength: number;
        nonIndentationsTakeUpPercentageOfOriginal: number;
        commentsLength: number;
        commentsTakeUpPercentageOfOriginal: number;
        uglified: null | Obj;
    };
    result: string;
    countAfterCleaning: number;
    countBeforeCleaning: number;
    allInHead: string[];
    allInBody: string[];
    deletedFromHead: string[];
    deletedFromBody: string[];
}
declare const defaults: Opts;
/**
 * Remove unused CSS from email templates
 */
declare function comb(str: string, originalOpts?: Partial<Opts>): Res;

export { comb, defaults, version };
