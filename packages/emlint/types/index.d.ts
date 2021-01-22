import { TypedEmitter } from 'tiny-typed-emitter';

declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

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

declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
declare type JsonObject = {
    [Key in string]?: JsonValue;
};
declare type JsonArray = Array<JsonValue>;
declare type Severity = 0 | 1 | 2;
interface RulesObj {
    [rulesName: string]: Severity | [severity: Severity, ...opts: string[]];
}
interface Config {
    rules: RulesObj;
}
interface AttribSupplementedWithParent extends Attrib {
    parent: TagToken;
}
declare type TagEvent = (node: TagToken) => void;
declare type AtEvent = (node: AtToken) => void;
declare type RuleEvent = (node: RuleToken) => void;
declare type TextEvent = (node: TextToken) => void;
declare type EspEvent = (node: EspToken) => void;
declare type CharacterEvent = ({ chr, i }: {
    chr: string;
    i: number;
}) => void;
declare type AttributeEvent = (node: AttribSupplementedWithParent) => void;
declare type AstEvent = (node: JsonObject[]) => void;
declare type CommentEvent = (node: CommentToken) => void;
declare type EntityEvent = (node: {
    idxFrom: number;
    idxTo: number;
}) => void;
interface RuleObjType {
    tag?: TagEvent;
    at?: AtEvent;
    rule?: RuleEvent;
    text?: TextEvent;
    esp?: EspEvent;
    character?: CharacterEvent;
    attribute?: AttributeEvent;
    ast?: AstEvent;
    comment?: CommentEvent;
    entity?: EntityEvent;
}
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
interface MessageObj extends ErrorObj {
    line: number;
    column: number;
    severity: Severity;
    keepSeparateWhenFixing: boolean;
}

interface ErrorObjWithRuleId extends ErrorObj {
    ruleId: string;
}
/**
 * Pluggable email template code linter
 */
declare class Linter extends TypedEmitter<RuleObjType> {
    constructor();
    messages: MessageObj[];
    str: string;
    strLineStartIndexes: number[];
    config: Config;
    hasBeenCalledWithKeepSeparateWhenFixing: boolean;
    processedRulesConfig: RulesObj;
    verify(str: string, config: Config): ErrorObj[];
    report(obj: ErrorObjWithRuleId): void;
}

declare type IdxRange = [charFrom: number, charTo: number];
declare type CbValues = (idxRange: IdxRange) => void;
interface Opts {
    offset: number;
    from: number;
    to: number;
}
declare function splitByWhitespace(str: string, cbValues: CbValues, cbWhitespace?: CbValues, originalOpts?: Partial<Opts>): void;

interface Opts$1 {
    caseInsensitive: boolean;
    canBeCommaSeparated: boolean;
    quickPermittedValues: (string | RegExp)[];
    permittedValues: string[];
    noSpaceAfterComma: boolean;
}
declare function validateString(str: string, idxOffset: number, originalOpts?: Partial<Opts$1>): ErrorObj[];

declare const wholeExtensionRegex: RegExp;
declare const isoDateRegex: RegExp;
declare const fontSizeRegex: RegExp;
declare const linkTypes: string[];
declare const astErrMessages: {
    "tag-missing-opening": string;
    "tag-missing-closing": string;
    "tag-void-frontal-slash": string;
};
declare function isLetter(str: unknown): boolean;
declare function isAnEnabledValue(maybeARulesValue: unknown): Severity;
declare function isObj(something: unknown): boolean;
declare function isAnEnabledRule(rules: RulesObj, ruleId: string): Severity;

declare const util_wholeExtensionRegex: typeof wholeExtensionRegex;
declare const util_splitByWhitespace: typeof splitByWhitespace;
declare const util_isAnEnabledValue: typeof isAnEnabledValue;
declare const util_isAnEnabledRule: typeof isAnEnabledRule;
declare const util_astErrMessages: typeof astErrMessages;
declare const util_validateString: typeof validateString;
declare const util_fontSizeRegex: typeof fontSizeRegex;
declare const util_isoDateRegex: typeof isoDateRegex;
declare const util_linkTypes: typeof linkTypes;
declare const util_isLetter: typeof isLetter;
declare const util_isObj: typeof isObj;
declare namespace util {
  export {
    util_wholeExtensionRegex as wholeExtensionRegex,
    util_splitByWhitespace as splitByWhitespace,
    util_isAnEnabledValue as isAnEnabledValue,
    util_isAnEnabledRule as isAnEnabledRule,
    util_astErrMessages as astErrMessages,
    util_validateString as validateString,
    util_fontSizeRegex as fontSizeRegex,
    util_isoDateRegex as isoDateRegex,
    util_linkTypes as linkTypes,
    util_isLetter as isLetter,
    util_isObj as isObj,
  };
}

declare const version: string;

export { Linter, util, version };
