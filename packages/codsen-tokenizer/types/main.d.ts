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
    attribName: null | string;
    attribNameRecognised: null | boolean;
    attribNameStartsAt: null | number;
    attribNameEndsAt: null | number;
    attribOpeningQuoteAt: null | number;
    attribClosingQuoteAt: null | number;
    attribValueRaw: null | string;
    attribValue: (TextToken | Property | CommentToken | EspToken)[];
    attribValueStartsAt: null | number;
    attribValueEndsAt: null | number;
    attribStarts: null | number;
    attribEnds: null | number;
    attribLeft: null | number;
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
    tagNameStartsAt: null | number;
    tagNameEndsAt: null | number;
    tagName: null | string;
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
    query: null | string;
    queryStartsAt: null | number;
    queryEndsAt: null | number;
    openingCurlyAt: null | number;
    closingCurlyAt: null | number;
    rules: (RuleToken | TextToken)[];
}
declare type Token = TextToken | TagToken | RuleToken | AtToken | CommentToken | EspToken;
interface LayerKindAt {
    type: "at";
    token: AtToken;
}
interface LayerSimple {
    type: "simple" | "block";
    value: string;
    position: number;
}
interface LayerEsp {
    type: "esp";
    openingLump: string;
    guessedClosingLump: string;
    position: number;
}
declare type Layer = LayerKindAt | LayerSimple | LayerEsp;
interface CharacterToken {
    chr: string;
    i: number;
    type: TokenType;
}
interface Opts {
    tagCb: null | ((token: Token, next: Token[]) => void);
    tagCbLookahead: number;
    charCb: null | ((char: CharacterToken, next: CharacterToken[]) => void);
    charCbLookahead: number;
    reportProgressFunc: null | ((percDone: number) => void);
    reportProgressFuncFrom: number;
    reportProgressFuncTo: number;
}

declare function matchLayerLast(wholeEspTagLump: string, layers: Layer[], matchFirstInstead?: boolean): undefined | number;

declare const version: string;
declare const defaults: Opts;
interface Res {
    timeTakenInMilliseconds: number;
}
declare function tokenizer(str: string, originalOpts?: Partial<Opts>): Res;
declare const util: {
    matchLayerLast: typeof matchLayerLast;
};

export { defaults, tokenizer, util, version };
