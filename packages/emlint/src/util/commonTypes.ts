/* eslint no-use-before-define: 0 */

import { Range, Ranges } from "../../../../scripts/common";
import {
  // TagToken,
  AtToken,
  RuleToken,
  TextToken,
  EspToken,
  Attrib,
  Property,
  // CommentToken,
} from "../../../codsen-tokenizer/src/util/util";
import {
  ErrorObj,
  TagTokenWithChildren,
  CommentTokenWithChildren,
} from "../../../codsen-parser/src/main";

// From "type-fest" by Sindre Sorhus:
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = Array<JsonValue>;

type Severity = 0 | 1 | 2;

interface Obj {
  [key: string]: any;
}

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

type EventNames = keyof RuleObjType;

interface MessageObj extends ErrorObj {
  line: number;
  column: number;
  severity: Severity;
  keepSeparateWhenFixing: boolean;
}

export {
  Obj,
  Range,
  Attrib,
  Config,
  Ranges,
  AtEvent,
  ErrorObj,
  RulesObj,
  TagEvent,
  EspEvent,
  Property,
  AstEvent,
  Severity,
  RuleEvent,
  TextEvent,
  MessageObj,
  EventNames,
  RuleObjType,
  CharacterEvent,
  AttributeEvent,
  TagTokenWithChildren,
  AttribSupplementedWithParent,
};
