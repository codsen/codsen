import { Ranges as Ranges$1 } from "ranges-push";

type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Attribute {
  nameStarts: number;
  nameEnds: number;
  equalsAt?: number;
  name: string;
  valueStarts?: number;
  valueEnds?: number;
  value?: string;
}
interface Tag {
  attributes: Attribute[];
  lastClosingBracketAt: number;
  lastOpeningBracketAt: number;
  slashPresent: number;
  leftOuterWhitespace: number;
  onlyPlausible: boolean;
  nameStarts: number;
  nameContainsLetters: boolean;
  nameEnds: number;
  name: string;
}
interface CbObj {
  tag: Tag;
  deleteFrom: null | number;
  deleteTo: null | number;
  insert: null | undefined | string;
  rangesArr: Ranges$1;
  proposedReturn: Range | null;
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
  cb: null | ((cbObj: CbObj) => void);
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}
declare const defaults: Opts;
interface Res {
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

export { Attribute, CbObj, Opts, Res, Tag, defaults, stripHtml, version };
