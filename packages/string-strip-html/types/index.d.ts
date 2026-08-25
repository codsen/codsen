import { Ranges as Ranges$1 } from "ranges-push";

type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Attribute {
  readonly nameStarts?: number;
  readonly nameEnds?: number;
  readonly equalsAt?: number;
  readonly name?: string;
  readonly valueStarts?: number;
  readonly valueEnds?: number;
  readonly value?: string;
}
interface TokenBase {
  readonly start: number;
  readonly end: number;
}
interface NamedTagBase extends TokenBase {
  readonly kind: "tag";
  readonly attributes: readonly Attribute[];
  readonly slashPresent: number | false;
  readonly leftOuterWhitespace: number;
  readonly onlyPlausible: boolean;
  readonly nameStarts: number;
  readonly nameContainsLetters: boolean;
  readonly nameEnds: number;
  readonly name: string;
}
interface CompleteTag extends NamedTagBase {
  readonly status: "complete";
  readonly lastClosingBracketAt: number;
  readonly lastOpeningBracketAt: number;
}
interface IncompleteTag extends NamedTagBase {
  readonly status: "incomplete";
  readonly lastClosingBracketAt?: never;
  readonly lastOpeningBracketAt: number;
}
interface InferredTag extends TokenBase {
  readonly kind: "tag";
  readonly status: "inferred";
  readonly nameStarts: number;
  readonly nameContainsLetters: boolean;
  readonly nameEnds: number;
  readonly name: string;
}
interface CommentTag extends TokenBase {
  readonly kind: "comment";
}
interface CdataTag extends TokenBase {
  readonly kind: "cdata";
}
type CallbackToken =
  | CompleteTag
  | IncompleteTag
  | InferredTag
  | CommentTag
  | CdataTag;
type Tag = CallbackToken;
type CallbackRange = readonly [
  from: number,
  to: number,
  whatToInsert: string | null | undefined,
];
interface CbObj {
  readonly tag: Tag;
  readonly deleteFrom: null | number;
  readonly deleteTo: null | number;
  readonly insert: null | undefined | string;
  readonly rangesArr: Ranges$1;
  readonly proposedReturn: CallbackRange | null;
}
interface Opts {
  ignoreTags: string[];
  ignoreTagsWithTheirContents: string[];
  onlyStripTags: string[];
  stripTogetherWithTheirContents: string[];
  skipHtmlDecoding: boolean;
  trimOnlySpaces: boolean;
  stripRecognisedHTMLOnly: boolean;
  dumpLinkHrefsNearby: {
    enabled?: boolean;
    putOnNewLine?: boolean;
    wrapHeads?: string;
    wrapTails?: string;
  };
  ignoreIndentations: boolean;
  cb: null | ((cbObj: CbObj) => void);
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}
declare const defaults: Opts;
interface Res {
  /** Best-effort elapsed time for user-facing completion feedback. */
  log: {
    timeTakenInMilliseconds: number;
  };
  result: string;
  ranges: Ranges;
  allTagLocations: [number, number][];
  filteredTagLocations: [number, number][];
}
/**
 * Strips HTML tags from strings. No parser, accepts mixed sources.
 */
declare function stripHtml(str: string, opts?: Partial<Opts>): Res;

export { defaults, stripHtml, version };
export type {
  Attribute,
  CallbackRange,
  CallbackToken,
  CbObj,
  CdataTag,
  CommentTag,
  CompleteTag,
  IncompleteTag,
  InferredTag,
  Opts,
  Res,
  Tag,
};
