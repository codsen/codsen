import { TypedEmitter } from "tiny-typed-emitter";
import {
  TagToken,
  CommentToken as CommentToken$1,
  TextToken as TextToken$1,
  RuleToken as RuleToken$1,
  AtToken as AtToken$1,
  EspToken as EspToken$1,
} from "codsen-tokenizer";

type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

interface Selector {
  value: string;
  selectorStarts: number;
  selectorEnds: number;
}
type CommentKind = "simple" | "only" | "not" | "block" | "line" | "simplet";
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
type PropertyValueWithinArray = TextToken | EspToken;
interface Property {
  property: null | string;
  propertyStarts: null | number;
  propertyEnds: null | number;
  colon: null | number;
  value: string | PropertyValueWithinArray[];
  valueStarts: null | number;
  valueEnds: null | number;
  importantStarts: null | number;
  importantEnds: null | number;
  important: null | string;
  semi: null | number;
  start: number;
  end: number;
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

type Severity$1 = 0 | 1 | 2;
interface ErrorObj {
  ruleId?: string;
  message: string;
  idxFrom: number;
  idxTo: number;
  fix: null | {
    ranges: Ranges;
  };
  severity?: Severity$1;
  keepSeparateWhenFixing?: boolean;
}
interface TagTokenWithChildren extends TagToken {
  children: TokenWithChildren[];
}
interface CommentTokenWithChildren extends CommentToken$1 {
  children: TokenWithChildren[];
}
type TokenWithChildren =
  | TextToken$1
  | TagTokenWithChildren
  | RuleToken$1
  | AtToken$1
  | CommentTokenWithChildren
  | EspToken$1;

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = {
  [Key in string]?: JsonValue;
};
type JsonArray = JsonValue[];
type Severity = 0 | 1 | 2;
interface RulesObj {
  [rulesName: string]: Severity | [severity: Severity, ...opts: string[]];
}
interface Config {
  rules: RulesObj;
}
interface AttribSupplementedWithParent extends Attrib {
  parent: TagTokenWithChildren;
}
type TagEvent = (node: TagTokenWithChildren) => void;
type AtEvent = (node: AtToken) => void;
type RuleEvent = (node: RuleToken) => void;
type TextEvent = (node: TextToken) => void;
type EspEvent = (node: EspToken) => void;
type CharacterEvent = ({ chr, i }: { chr: string; i: number }) => void;
type AttributeEvent = (node: AttribSupplementedWithParent) => void;
type AstEvent = (node: JsonObject[]) => void;
type CommentEvent = (node: CommentTokenWithChildren) => void;
type EntityEvent = (node: { idxFrom: number; idxTo: number }) => void;
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

type IdxRange = [charFrom: number, charTo: number];
type CbValues = (idxRange: IdxRange) => void;
interface Opts$1 {
  offset: number;
  from: number;
  to: number;
}
declare function splitByWhitespace(
  str: string,
  cbValues: CbValues,
  cbWhitespace?: CbValues,
  originalOpts?: Partial<Opts$1>
): void;

declare const badChars: Map<number, string>;

interface Opts {
  caseInsensitive: boolean;
  canBeCommaSeparated: boolean;
  quickPermittedValues: (string | RegExp)[];
  permittedValues: string[];
  noSpaceAfterComma: boolean;
}
declare function validateString(
  str: string,
  idxOffset: number,
  originalOpts?: Partial<Opts>
): ErrorObj[];

declare const wholeExtensionRegex: RegExp;
declare const isoDateRegex: RegExp;
declare const fontSizeRegex: RegExp;
declare const linkTypes: string[];
declare const astErrMessages: {
  "tag-missing-opening": string;
  "tag-missing-closing": string;
  "tag-void-frontal-slash": string;
};
declare function isAnEnabledValue(maybeARulesValue: unknown): Severity;
declare function isAnEnabledRule(rules: RulesObj, ruleId: string): Severity;

declare const util_astErrMessages: typeof astErrMessages;
declare const util_badChars: typeof badChars;
declare const util_fontSizeRegex: typeof fontSizeRegex;
declare const util_isAnEnabledRule: typeof isAnEnabledRule;
declare const util_isAnEnabledValue: typeof isAnEnabledValue;
declare const util_isoDateRegex: typeof isoDateRegex;
declare const util_linkTypes: typeof linkTypes;
declare const util_splitByWhitespace: typeof splitByWhitespace;
declare const util_validateString: typeof validateString;
declare const util_wholeExtensionRegex: typeof wholeExtensionRegex;
declare namespace util {
  export {
    util_astErrMessages as astErrMessages,
    util_badChars as badChars,
    util_fontSizeRegex as fontSizeRegex,
    util_isAnEnabledRule as isAnEnabledRule,
    util_isAnEnabledValue as isAnEnabledValue,
    util_isoDateRegex as isoDateRegex,
    util_linkTypes as linkTypes,
    util_splitByWhitespace as splitByWhitespace,
    util_validateString as validateString,
    util_wholeExtensionRegex as wholeExtensionRegex,
  };
}

declare const version: string;

export { Linter, util, version };
