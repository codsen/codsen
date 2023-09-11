import {
  TagToken,
  CommentToken,
  TextToken,
  RuleToken,
  AtToken,
  EspToken,
  CharCb,
} from "codsen-tokenizer";

type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
type Severity = 0 | 1 | 2;
interface ErrorObj {
  ruleId?: string;
  message: string;
  idxFrom: number;
  idxTo: number;
  fix: null | {
    ranges: Ranges;
  };
  severity?: Severity;
  keepSeparateWhenFixing?: boolean;
}
interface IdxRangeObj {
  idxFrom: number;
  idxTo: number;
}
interface TagTokenWithChildren extends TagToken {
  children: TokenWithChildren[];
}
interface CommentTokenWithChildren extends CommentToken {
  children: TokenWithChildren[];
}
type TokenWithChildren =
  | TextToken
  | TagTokenWithChildren
  | RuleToken
  | AtToken
  | CommentTokenWithChildren
  | EspToken;
interface SupplementedErrorObj extends ErrorObj {
  tokenObj: TokenWithChildren;
}
type ErrCb = (obj: Partial<SupplementedErrorObj>) => void;
interface Opts {
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  tagCb: null | ((obj: TokenWithChildren) => void);
  charCb: null | CharCb;
  errCb: null | ErrCb;
}
declare const defaults: Opts;
/**
 * Parser aiming at broken or mixed code, especially HTML & CSS
 */
declare function cparser(str: string, opts?: Partial<Opts>): any[];

export {
  type CommentTokenWithChildren,
  type ErrCb,
  type ErrorObj,
  type IdxRangeObj,
  type Opts,
  type Severity,
  type SupplementedErrorObj,
  type TagTokenWithChildren,
  type TokenWithChildren,
  cparser,
  defaults,
  version,
};
