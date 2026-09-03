import { Opts as Opts$1 } from "html-crush";

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
  htmlCrushOpts: Partial<Opts$1>;
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}
interface InputOpts {
  whitelist?: string | string[];
  backend?: HeadsAndTailsObj[];
  uglify?: boolean | 0 | 1;
  removeHTMLComments?: boolean;
  removeCSSComments?: boolean;
  doNotRemoveHTMLCommentsWhoseOpeningTagContains?: string | string[];
  htmlCrushOpts?: Partial<Opts$1>;
  reportProgressFunc?: null | false | 0 | ((percDone: number) => void);
  reportProgressFuncFrom?: number;
  reportProgressFuncTo?: number;
}
type UglifyOpts = Omit<InputOpts, "uglify">;
type StringifiedLegend = [string, string];
interface Res {
  /** Best-effort completion statistics for user-facing feedback.
   * Observational fields do not affect the transformation. */
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
    uglified: null | StringifiedLegend[];
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
declare function comb(str: string, opts?: InputOpts | null): Res;
/**
 * Remove unused CSS and uglify the remaining class and ID selectors.
 */
declare function uglify(str: string, opts?: UglifyOpts | null): Res;

export { comb, defaults, uglify, version };
export type { HeadsAndTailsObj, InputOpts, Opts, Res, UglifyOpts };
