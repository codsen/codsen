import {
  TagToken,
  CommentToken,
  TextToken,
  RuleToken,
  AtToken,
  EspToken,
  CharCb,
} from "codsen-tokenizer";

declare type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
declare type Severity = 0 | 1 | 2;
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
interface TagTokenWithChildren extends TagToken {
  children: TokenWithChildren[];
}
interface CommentTokenWithChildren extends CommentToken {
  children: TokenWithChildren[];
}
declare type TokenWithChildren =
  | TextToken
  | TagTokenWithChildren
  | RuleToken
  | AtToken
  | CommentTokenWithChildren
  | EspToken;
interface SupplementedErrorObj extends ErrorObj {
  tokenObj: TokenWithChildren;
}
declare type ErrCb = (obj: Partial<SupplementedErrorObj>) => void;
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
declare function cparser(str: string, originalOpts?: Partial<Opts>): any[];

export {
  CommentTokenWithChildren,
  ErrorObj,
  TagTokenWithChildren,
  TokenWithChildren,
  cparser,
  defaults,
  version,
};
