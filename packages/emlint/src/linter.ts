import { TypedEmitter } from "tiny-typed-emitter";
import { fixEnt } from "string-fix-broken-named-entities";
import { traverse } from "ast-monkey-traverse";
import { lineCol, getLineStartIndexes } from "line-column-mini";
import clone from "lodash.clonedeep";
import { cparser } from "codsen-parser";

import validateCharEncoding from "../src/util/validateCharEncoding";
import { get, normaliseRequestedRules } from "./rules";
import {
  isAnEnabledValue,
  isAnEnabledRule,
  astErrMessages,
  isObj,
} from "./util/util";
import {
  Obj,
  ErrorObj,
  Attrib,
  Severity,
  Config,
  MessageObj,
  Ranges,
  RulesObj,
  EventNames,
  RuleObjType,
} from "./util/commonTypes";

interface ErrorObjWithRuleId extends ErrorObj {
  ruleId: string;
}

// disable the max limit of listeners
TypedEmitter.defaultMaxListeners = 0;

/**
 * Pluggable email template code linter
 */
class Linter extends TypedEmitter<RuleObjType> {
  constructor() {
    super();
    this.messages = [];
    this.str = "";
    this.strLineStartIndexes = [];
    this.config = {} as Config;
    this.hasBeenCalledWithKeepSeparateWhenFixing = false;
    this.processedRulesConfig = {} as RulesObj;
  }

  messages: MessageObj[];
  str: string;
  strLineStartIndexes: number[]; // comes from line-column-mini
  config: Config;
  hasBeenCalledWithKeepSeparateWhenFixing: boolean;
  processedRulesConfig: RulesObj;

  verify(str: string, config: Config): ErrorObj[] {
    this.messages = [];
    this.str = str;
    // calculate line start indexes for row/column
    // reporting later, it allows line-column-mini to cut corners
    this.strLineStartIndexes = getLineStartIndexes(str);
    this.config = clone(config);
    this.hasBeenCalledWithKeepSeparateWhenFixing = false;
    this.processedRulesConfig = {};
    let has = Object.prototype.hasOwnProperty;

    // console.log(
    //   `069 ${`\u001b[${31}m${`██`}\u001b[${39}m`}${`\u001b[${33}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify called for "${str}" and ${JSON.stringify(
    //     config,
    //     null,
    //     4
    //   )}`
    // );

    // VALIDATION FIRST
    if (config) {
      if (typeof config !== "object") {
        throw new Error(
          `emlint/verify(): [THROW_ID_01] second input argument, config is not a plain object but ${typeof config}. It's equal to:\n${JSON.stringify(
            config,
            null,
            4
          )}`
        );
      } else if (!Object.keys(config).length) {
        // empty config => early return
        return [];
      } else if (!config.rules || typeof config.rules !== "object") {
        throw new Error(
          `emlint/verify(): [THROW_ID_02] config contains no rules! It was given as:\n${JSON.stringify(
            config,
            null,
            4
          )}`
        );
      }
    } else {
      // falsey config => early return
      return [];
    }

    // detect the language
    // const lang = detectLanguage(str);

    // filter out all applicable values and make them listen for events that
    // tokenizer emits
    // TODO - rebase, avoid using const, assign directly to "this."
    let processedRulesConfig = normaliseRequestedRules(config.rules);
    console.log(
      `111 ${`\u001b[${33}m${`processedRulesConfig`}\u001b[${39}m`} = ${JSON.stringify(
        processedRulesConfig,
        null,
        4
      )}`
    );
    this.processedRulesConfig = processedRulesConfig;

    Object.keys(processedRulesConfig)
      // filter out the rules coming from external packages - they'll be
      // processed separately, in the callbacks coming out of external packages,
      // see the section "rules coming from standalone packages".
      .filter((ruleName) => get(ruleName))
      // filter out enabled rules:
      .filter((ruleName) => {
        // same config like in ESLint - 0 is off, 1 is warning, 2 is error
        if (typeof processedRulesConfig[ruleName] === "number") {
          return processedRulesConfig[ruleName] > 0;
        }
        if (Array.isArray(processedRulesConfig[ruleName])) {
          console.log(
            `132 ███████████████████████████████████████ ${`\u001b[${33}m${`ruleName`}\u001b[${39}m`} = ${JSON.stringify(
              ruleName,
              null,
              4
            )}`
          );
          return (processedRulesConfig as any)[ruleName][0] > 0;
        }
        return false;
      })
      .forEach((rule) => {
        console.log(
          `144 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: filtering rule ${rule}`
        );
        // extract all the options, second array element onwards - the length is indeterminable
        let rulesFunction: RulesObj;
        if (
          Array.isArray(processedRulesConfig[rule]) &&
          (processedRulesConfig[rule] as any).length > 1
        ) {
          // pass not only "this", the context, but also all the opts, as args
          rulesFunction = get(rule)(
            this,
            ...(processedRulesConfig as any)[rule].slice(1)
          );
        } else {
          // just pass "this", the context
          rulesFunction = get(rule)(this);
        }

        Object.keys(rulesFunction).forEach((consumedNode: string) => {
          this.on(consumedNode as EventNames, (...args: any[]) => {
            // console.log(
            //   `106 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`consumedNode`}\u001b[${39}m`} = ${JSON.stringify(
            //     consumedNode,
            //     null,
            //     4
            //   )}`
            // );
            (rulesFunction as Obj)[consumedNode](...args);
          });
        });
      });

    // emlint runs on codsen-parser which in turn runs on codsen-tokenizer.

    // Tokenizer recognises string as various token types and "pings" the
    // callback function given to the tokenizer with those lumps, plain objects.

    // Now, Parser consumes those tokens and assembles a tree, an AST.

    // EMLint is plugin-based. Plugins work on code source - consuming either
    // raw tokens, each token of particular kind, listening to event emitted
    // called after that token type, or plugins consume whole AST, listening
    // to "ast"-type event.

    // Now, the less work done the faster program runs.

    // The quickest way for emlint to obtain tokens is from codsen-parser,
    // to tap them raw, bypassing the AST tree, as they come from tokenizer.

    // But the problem is, this approach does not work with broken code.

    // We can't consume tokenizer's nodes because parser can change the
    // nodes, correcting the errors - it's possible because parser "sees" the
    // whole picture.

    // Therefore, we don't consume tokens from the tokenizer, we consume AST
    // from parser, then we send the monkey (ast-monkey-traverse) to traverse
    // that AST and emit the token events.

    this.emit(
      "ast",
      traverse(
        cparser(str, {
          charCb: (obj) => {
            // We call the character-level callback from raw characters, coming
            // if from parser which comes straight from tokenizer.

            // console.log(
            //   `160 ██ ${`\u001b[${35}m${`linter/charCb():`}\u001b[${39}m`} incoming ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
            //     obj,
            //     null,
            //     4
            //   )}`
            // );
            this.emit("character", obj);
          },
          errCb: (obj) => {
            console.log(
              `222 ██ ${`\u001b[${35}m${`linter/errCb():`}\u001b[${39}m`} incoming ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
                obj,
                null,
                4
              )}`
            );
            console.log(
              `229 ${`\u001b[${33}m${`config.rules`}\u001b[${39}m`} = ${JSON.stringify(
                config.rules,
                null,
                4
              )}`
            );

            // check, is rule enabled at the first place:
            let currentRulesSeverity: Severity = isAnEnabledRule(
              config.rules,
              obj.ruleId as string
            );
            if (currentRulesSeverity) {
              let message = `Something is wrong.`;

              if (
                isObj(obj) &&
                typeof obj.ruleId === "string" &&
                has.call(astErrMessages, obj.ruleId)
              ) {
                message = (astErrMessages as any)[obj.ruleId];
              }

              console.log(
                `253 ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`} "${message}"`
              );
              this.report({
                message,
                severity: currentRulesSeverity,
                fix: null,
                ...(obj as any),
              });
            }
          },
        }),
        (key, val, innerObj) => {
          let current = val !== undefined ? val : key;
          if (
            isObj(current) &&
            (!innerObj.parentKey || !innerObj.parentKey.startsWith("attrib"))
          ) {
            // console.log(` `);
            // console.log(
            //   `-----------------------------------------------------------------------------`
            // );
            // console.log(` `);
            // console.log(
            //   `275 ${`\u001b[${33}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
            //     innerObj,
            //     null,
            //     4
            //   )}`
            // );
            // monkey will traverse every key, every string within.
            // We need to pick the objects of a type we need: "tag", "comment" etc.

            // tag-level callback
            // console.log(
            //   `286 ██ ${`\u001b[${35}m${`linter/tagCb():`}\u001b[${39}m`} PING ${
            //     current.type
            //   } - ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
            //     current,
            //     null,
            //     4
            //   )}`
            // );
            this.emit(current.type, current);
            // plus, for type:html also ping each attribute
            if (
              current.type === "tag" &&
              Array.isArray(current.attribs) &&
              current.attribs.length
            ) {
              current.attribs.forEach((attribObj: Attrib) => {
                console.log(
                  `304 ${`\u001b[${36}m${`██`}\u001b[${39}m`} ping attribute ${JSON.stringify(
                    attribObj,
                    null,
                    4
                  )}`
                );
                this.emit("attribute", {
                  ...attribObj,
                  parent: { ...current },
                });
              });
            }
          }
          return current;
        }
      )
    );
    console.log(` `);
    console.log(
      `-----------------------------------------------------------------------------`
    );
    console.log(` `);

    //
    //
    //
    //
    //
    //
    //                rules coming from standalone packages
    //
    //
    //
    //
    //
    //

    // 1. if any of bad named HTML entity catcher rules is requested, run it
    // rules come from "string-fix-broken-named-entities":
    // - bad-html-entity-malformed-...
    // - bad-html-entity-malformed-numeric
    // - bad-html-entity-encoded-...
    // - bad-html-entity-encoded-numeric
    // - bad-html-entity-unrecognised
    // - bad-html-entity-multiple-encoding

    // 2. also, using the raw ampersand-as-text catcher, feed
    // the rule "character-encode" - we need to be aware which
    // ampersand is raw text, which-one is part of entity

    let severity: 0 | 1 | 2 = 0;
    let letsCatchBadEntities = Object.keys(config.rules).some(
      (ruleName) =>
        (ruleName === "all" || ruleName.startsWith("bad-html-entity")) &&
        (severity =
          isAnEnabledValue(config.rules[ruleName]) ||
          isAnEnabledValue(processedRulesConfig[ruleName]))
    );
    let letsCatchRawTextAmpersands = Object.keys(config.rules).some(
      (ruleName) =>
        (ruleName === "all" || ruleName === "character-encode") &&
        (isAnEnabledValue(config.rules[ruleName]) ||
          isAnEnabledValue(processedRulesConfig[ruleName]))
    );

    if (letsCatchBadEntities || letsCatchRawTextAmpersands) {
      console.log(
        `371 linter.js: we'll call fixEnt(); ${`\u001b[${
          letsCatchBadEntities ? 32 : 31
        }m${"letsCatchBadEntities"}\u001b[${39}m`}; ${`\u001b[${
          letsCatchRawTextAmpersands ? 32 : 31
        }m${"letsCatchRawTextAmpersands"}\u001b[${39}m`};`
      );
      fixEnt(str, {
        cb: letsCatchBadEntities
          ? (obj) => {
              console.log(
                `381 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
                  obj,
                  null,
                  4
                )}`
              );

              // Object.keys(config.rules).includes("bad-html-entity")

              if (Number.isInteger(severity) && severity) {
                let message;
                if (obj.ruleName === "bad-html-entity-malformed-nbsp") {
                  message = "Malformed nbsp entity.";
                } else if (obj.ruleName === "bad-html-entity-unrecognised") {
                  message = "Unrecognised named entity.";
                } else if (
                  obj.ruleName === "bad-html-entity-multiple-encoding"
                ) {
                  message = "HTML entity encoding over and over.";
                } else if (
                  obj.ruleName === "bad-html-entity-malformed-numeric"
                ) {
                  message = "Malformed numeric entity.";
                } else {
                  message = `Malformed ${
                    obj.entityName ? obj.entityName : "named"
                  } entity.`;
                }

                console.log(
                  `411 FIY, ${`\u001b[${33}m${`message`}\u001b[${39}m`} = ${JSON.stringify(
                    message,
                    null,
                    4
                  )}`
                );

                let ranges: Ranges = [
                  [
                    obj.rangeFrom,
                    obj.rangeTo,
                    obj.rangeValEncoded ? obj.rangeValEncoded : "",
                  ],
                ];
                if (obj.ruleName === "bad-html-entity-unrecognised") {
                  ranges = [];
                }

                this.report({
                  severity,
                  ruleId: obj.ruleName,
                  message,
                  idxFrom: obj.rangeFrom,
                  idxTo: obj.rangeTo,
                  fix: {
                    ranges,
                  },
                });
              }
            }
          : undefined,
        entityCatcherCb: letsCatchBadEntities
          ? (from, to) => {
              console.log(
                `445 linter.js: entityCatcher pinging { from: ${from}, to: ${to} }`
              );
              this.emit("entity", { idxFrom: from, idxTo: to });
            }
          : undefined,
        textAmpersandCatcherCb: letsCatchRawTextAmpersands
          ? (posIdx) => {
              console.log(`452`);
              let mode: "numeric" | "named" | undefined;
              if (
                Array.isArray(processedRulesConfig["character-encode"]) &&
                processedRulesConfig["character-encode"].includes("numeric")
              ) {
                mode = "numeric";
                // else, it's undefined which will fall back to "named"
              }
              console.log(
                `462 RAW AMP, ${`\u001b[${32}m${`CALL`}\u001b[${39}m`} validateCharEncoding()`
              );
              console.log(
                `465 ███████████████████*███████████████████ Object.keys(this) = ${JSON.stringify(
                  Object.keys(this),
                  null,
                  4
                )}`
              );
              validateCharEncoding("&", posIdx, mode, this);
            }
          : undefined,
      });
    }

    // remove all listeners

    // extract all keys from the events interface
    let allEventNames: (keyof RuleObjType)[] = [
      "tag",
      "at",
      "rule",
      "text",
      "esp",
      "character",
      "attribute",
      "ast",
      "comment",
      "entity",
    ];
    allEventNames.forEach((eventName) => {
      this.removeAllListeners(eventName);
    });

    console.log(
      `497 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify() final return is called;\nthis.messages=${JSON.stringify(
        this.messages,
        null,
        4
      )}`
    );
    return clone(this.messages);
  }

  report(obj: ErrorObjWithRuleId): void {
    console.log(
      `508 ${`\u001b[${32}m${`linter.js/report()`}\u001b[${39}m`}: called with ${JSON.stringify(
        obj,
        null,
        4
      )}; this.hasBeenCalledWithKeepSeparateWhenFixing = ${
        this.hasBeenCalledWithKeepSeparateWhenFixing
      }`
    );

    // fill in other data points:
    let { line, col } = lineCol(
      this.strLineStartIndexes,
      obj.idxFrom,
      true
    ) as Obj;
    let severity: Severity = obj.severity || 0; // rules coming from 3rd party packages will give the severity value
    console.log(
      `525 ${`\u001b[${32}m${`linter.js/report()`}\u001b[${39}m`}: ${`\u001b[${33}m${`this.processedRulesConfig[obj.ruleId]`}\u001b[${39}m`} = ${JSON.stringify(
        this.processedRulesConfig[obj.ruleId],
        null,
        4
      )}`
    );
    if (
      !Number.isInteger(obj.severity) &&
      typeof this.processedRulesConfig[obj.ruleId] === "number"
    ) {
      severity = this.processedRulesConfig[obj.ruleId] as Severity;
    } else if (
      !Number.isInteger(obj.severity) &&
      Array.isArray(this.processedRulesConfig[obj.ruleId])
    ) {
      severity = (this.processedRulesConfig[obj.ruleId] as any[])[0];
    }
    console.log(
      `543 ${`\u001b[${32}m${`linter.js/report()`}\u001b[${39}m`}: line = ${line}; column = ${col}`
    );
    console.log(
      `546 ${`\u001b[${32}m${`linter.js/report()`}\u001b[${39}m`}: ${`\u001b[${33}m${`this.messages`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
        this.messages,
        null,
        4
      )}`
    );

    this.messages.push({
      keepSeparateWhenFixing: false,
      line,
      column: col,
      severity,
      ...obj,
      ...(this.hasBeenCalledWithKeepSeparateWhenFixing ? { fix: null } : {}),
    });
    console.log(
      `562 ${`\u001b[${32}m${`linter.js/report()`}\u001b[${39}m`}: ${`\u001b[${33}m${`this.messages`}\u001b[${39}m`} AFTER: ${JSON.stringify(
        this.messages,
        null,
        4
      )}`
    );

    // After pushing, let's manage "keepSeparateWhenFixing" messages -
    // make a note of the first incoming message with "keepSeparateWhenFixing"
    // key, in order to remove "fix" values from all other incoming messages
    // with "keepSeparateWhenFixing" key. That's necessary to support certain
    // fixes composition.
    if (
      obj.keepSeparateWhenFixing &&
      !this.hasBeenCalledWithKeepSeparateWhenFixing &&
      obj.fix
    ) {
      this.hasBeenCalledWithKeepSeparateWhenFixing = true;
    }

    console.log(
      `583 ${`\u001b[${32}m${`linter.js/report()`}\u001b[${39}m`}: ENDING this.hasBeenCalledWithKeepSeparateWhenFixing = ${
        this.hasBeenCalledWithKeepSeparateWhenFixing
      }`
    );
  }
}

export { Linter, RuleObjType };
