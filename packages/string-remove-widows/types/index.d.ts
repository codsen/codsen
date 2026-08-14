type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Obj {
  [key: string]: any;
}
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
declare function removeWidows(str: string, opts?: Partial<Opts>): Res;

export { defaults, removeWidows, version };
export type { HeadsAndTailsObj, Obj, Opts, Res };
