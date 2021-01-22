interface Selector {
    value: string;
    selectorStarts: number;
    selectorEnds: number;
}
interface Property {
    property: null | string;
    propertyStarts: null | number;
    propertyEnds: null | number;
    colon: null | number;
    value: string;
    valueStarts: null | number;
    valueEnds: null | number;
    semi: null | number;
    start: number;
    end: number;
}
declare type TokenType = "text" | "tag" | "rule" | "at" | "comment" | "esp";
declare type TokenKind = "simplet" | "not" | "doctype" | "cdata" | "xml" | "inline";
declare type CommentKind = "simple" | "only" | "not" | "block" | "line" | "simplet";
interface TextToken {
    type: "text";
    start: number;
    end: number;
    value: string;
}
interface CommentToken {
    type: "comment";
    start: number;
    end: number;
    value: string;
    closing: null | boolean;
    kind: CommentKind;
    language: "html" | "css";
}
interface EspToken {
    type: "esp";
    start: number;
    end: number;
    value: string;
    head: null | string;
    headStartsAt: null | number;
    headEndsAt: null | number;
    tail: null | string;
    tailStartsAt: null | number;
    tailEndsAt: null | number;
}
interface Attrib {
    attribName: string;
    attribNameRecognised: boolean;
    attribNameStartsAt: number;
    attribNameEndsAt: number;
    attribOpeningQuoteAt: null | number;
    attribClosingQuoteAt: null | number;
    attribValueRaw: string;
    attribValue: (TextToken | Property | CommentToken | EspToken)[];
    attribValueStartsAt: null | number;
    attribValueEndsAt: null | number;
    attribStarts: number;
    attribEnds: number;
    attribLeft: number;
}
interface RuleToken {
    type: "rule";
    start: number;
    end: number;
    value: string;
    left: null | number;
    nested: null | boolean;
    openingCurlyAt: null | number;
    closingCurlyAt: null | number;
    selectorsStart: null | number;
    selectorsEnd: null | number;
    selectors: Selector[];
    properties: (Property | TextToken)[];
}
interface TagToken {
    type: "tag";
    start: number;
    end: number;
    value: string;
    tagNameStartsAt: number;
    tagNameEndsAt: number;
    tagName: string;
    recognised: null | boolean;
    closing: null | boolean;
    void: null | boolean;
    pureHTML: null | boolean;
    kind: null | TokenKind;
    attribs: Attrib[];
}
interface AtToken {
    type: "at";
    start: number;
    end: number;
    value: string;
    left: null | number;
    nested: null | false;
    identifier: null | string;
    identifierStartsAt: null | number;
    identifierEndsAt: null | number;
    query: string;
    queryStartsAt: number;
    queryEndsAt: number;
    openingCurlyAt: null | number;
    closingCurlyAt: null | number;
    rules: (RuleToken | TextToken)[];
}
declare type Token = TextToken | TagToken | RuleToken | AtToken | CommentToken | EspToken;
interface CharacterToken {
    chr: string;
    i: number;
    type: TokenType;
}
declare type CharCb = (token: CharacterToken, next: CharacterToken[]) => void;

declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

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

declare const version: string;

interface SupplementedErrorObj extends ErrorObj {
    tokenObj: Token;
}
declare type ErrCb = (obj: Partial<SupplementedErrorObj>) => void;
interface Opts {
    reportProgressFunc: null | ((percDone: number) => void);
    reportProgressFuncFrom: number;
    reportProgressFuncTo: number;
    tagCb: null | ((obj: Token) => void);
    charCb: null | CharCb;
    errCb: null | ErrCb;
}
declare const defaults: Opts;
/**
 * Parser aiming at broken or mixed code, especially HTML & CSS
 */
declare function cparser(str: string, originalOpts?: Partial<Opts>): any[];

export { cparser, defaults, version };
