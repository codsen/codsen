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
type StringifiedLegend = [string, string];
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
declare function comb(str: string, opts?: Partial<Opts>): Res;

export { type HeadsAndTailsObj, type Opts, type Res, comb, defaults, version };
