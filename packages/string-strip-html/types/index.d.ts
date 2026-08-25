import { Ranges as Ranges$1 } from "ranges-push";

type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Attribute {
  nameStarts?: number;
  nameEnds?: number;
  equalsAt?: number;
  name?: string;
  valueStarts?: number;
  valueEnds?: number;
  value?: string;
}
interface TokenBase {
  start: number;
  end: number;
}
interface NamedTagBase extends TokenBase {
  kind: "tag";
  attributes: Attribute[];
  slashPresent: number | false;
  leftOuterWhitespace: number;
  onlyPlausible: boolean;
  nameStarts: number;
  nameContainsLetters: boolean;
  nameEnds: number;
  name: string;
}
interface CompleteTag extends NamedTagBase {
  status: "complete";
  lastClosingBracketAt: number;
  lastOpeningBracketAt: number;
}
interface IncompleteTag extends NamedTagBase {
  status: "incomplete";
  lastClosingBracketAt?: never;
  lastOpeningBracketAt: number;
}
interface InferredTag extends TokenBase {
  kind: "tag";
  status: "inferred";
  nameStarts: number;
  nameContainsLetters: boolean;
  nameEnds: number;
  name: string;
}
interface CommentTag extends TokenBase {
  kind: "comment";
}
interface CdataTag extends TokenBase {
  kind: "cdata";
}
type CallbackToken =
  | CompleteTag
  | IncompleteTag
  | InferredTag
  | CommentTag
  | CdataTag;
type Tag = CallbackToken;
type CallbackRange = [
  from: number,
  to: number,
  whatToInsert: string | null | undefined,
];
interface CbObj {
  tag: Tag;
  deleteFrom: null | number;
  deleteTo: null | number;
  insert: null | undefined | string;
  rangesArr: Ranges$1;
  proposedReturn: CallbackRange | null;
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
