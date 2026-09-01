type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Obj {
  [key: string]: any;
}
interface HeadsAndTailsObj {
  readonly heads: string | readonly string[];
  readonly tails: string | readonly string[];
}
type CountThreshold = number | false | null;
type IgnorePreset = "all" | "hexo" | "hugo" | "jinja" | "liquid" | "nunjucks";
type IgnoreEntry = HeadsAndTailsObj | IgnorePreset;
type TagRange =
  | readonly [from: number, to: number]
  | readonly [
      from: number,
      to: number,
      whatToInsert: string | null | undefined,
    ];
interface Opts {
  removeWidowPreventionMeasures: boolean;
  convertEntities: boolean;
  targetLanguage: "html" | "css" | "js";
  UKPostcodes: boolean;
  hyphens: boolean;
  minWordCount: CountThreshold;
  minCharCount: CountThreshold;
  ignore: IgnorePreset | readonly IgnoreEntry[];
  /** Receives finite, strictly increasing integer percentages within the inclusive configured bounds. */
  reportProgressFunc: false | null | ((percDone: number) => void);
  /** Inclusive progress lower bound; an integer from 0 through 100. */
  reportProgressFuncFrom: number;
  /** Inclusive progress upper bound; an integer from 0 through 100. */
  reportProgressFuncTo: number;
  /** Opaque half-open ranges. Overlong ends are clipped; an optional third range value is ignored. */
  tagRanges: readonly TagRange[] | null;
}
type PublicDefaults = Readonly<
  Omit<Opts, "ignore" | "tagRanges"> & {
    ignore: readonly IgnoreEntry[];
    tagRanges: readonly TagRange[];
  }
>;
declare const defaults: PublicDefaults;
interface Res {
  res: string;
  ranges: Ranges;
  /** Best-effort elapsed time for user-facing completion feedback. */
  log: {
    timeTakenInMilliseconds: number;
  };
  /** Operations that changed the final output. */
  whatWasDone: {
    removeWidows: boolean;
    convertEntities: boolean;
  };
  /** Options which could affect this input, independently of their current setting. */
  applicableOpts: {
    removeWidows: boolean;
    convertEntities: boolean;
  };
}
declare function removeWidows(str: string, opts?: Partial<Opts>): Res;

export { defaults, removeWidows, version };
export type {
  CountThreshold,
  HeadsAndTailsObj,
  IgnoreEntry,
  IgnorePreset,
  Obj,
  Opts,
  Res,
  TagRange,
};
