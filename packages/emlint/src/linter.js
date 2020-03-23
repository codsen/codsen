import stringFixBrokenNamedEntities from "string-fix-broken-named-entities";
import { get, normaliseRequestedRules } from "./rules";
import traverse from "ast-monkey-traverse";
import lineColumn from "line-column";
import clone from "lodash.clonedeep";
import parser from "codsen-parser";
import EventEmitter from "events";
import matcher from "matcher";
import {
  isAnEnabledValue,
  isAnEnabledRule,
  astErrMessages,
  isObj
} from "./util/util";

EventEmitter.defaultMaxListeners = 0;

class Linter extends EventEmitter {
  verify(str, config) {
    this.messages = [];
    this.str = str;
    this.config = clone(config);

    console.log(
      `025 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify called for "${str}" and ${JSON.stringify(
        config,
        null,
        4
      )}`
    );

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
        return this.messages;
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
      return this.messages;
    }

    // filter out all applicable values and make them listen for events that
    // tokenizer emits
    const processedRulesConfig = normaliseRequestedRules(config.rules);
    console.log(
      `063 ${`\u001b[${33}m${`processedRulesConfig`}\u001b[${39}m`} = ${JSON.stringify(
        processedRulesConfig,
        null,
        4
      )}`
    );
    this.processedRulesConfig = processedRulesConfig;

    Object.keys(processedRulesConfig)
      // filter out the rules coming from external packages - they'll be
      // processed separately, in the callbacks coming out og external packages,
      // see the section "rules coming from standalone packages".
      .filter(ruleName => get(ruleName))
      // filter out enabled rules:
      .filter(ruleName => {
        // same config like in ESLint - 0 is off, 1 is warning, 2 is error
        if (typeof processedRulesConfig[ruleName] === "number") {
          return processedRulesConfig[ruleName] > 0;
        } else if (Array.isArray(processedRulesConfig[ruleName])) {
          return processedRulesConfig[ruleName][0] > 0;
        }
      })
      .forEach(rule => {
        // console.log(
        //   `086 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: filtering rule ${rule}`
        // );
        // extract all the options, second array element onwards - the length is indeterminable
        let rulesFunction;
        if (
          Array.isArray(processedRulesConfig[rule]) &&
          processedRulesConfig[rule].length > 1
        ) {
          // pass not only "this", the context, but also all the opts, as args
          rulesFunction = get(rule)(
            this,
            ...processedRulesConfig[rule].slice(1)
          );
        } else {
          // just pass "this", the context
          rulesFunction = get(rule)(this);
        }
        Object.keys(rulesFunction).forEach(consumedNode => {
          this.on(consumedNode, (...args) => {
            // console.log(
            //   `106 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`consumedNode`}\u001b[${39}m`} = ${JSON.stringify(
            //     consumedNode,
            //     null,
            //     4
            //   )}`
            // );
            rulesFunction[consumedNode](...args);
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
        parser(str, {
          charCb: obj => {
            // We call the character-level callback from raw characters, coming
            // if from parser which comes straight from tokenizer.

            // console.log(
            //   `147 ██ ${`\u001b[${35}m${`linter/charCb():`}\u001b[${39}m`} incoming ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
            //     obj,
            //     null,
            //     4
            //   )}`
            // );
            this.emit("character", obj);
          },
          errCb: obj => {
            console.log(
              `164 ██ ${`\u001b[${35}m${`linter/errCb():`}\u001b[${39}m`} incoming ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
                obj,
                null,
                4
              )}`
            );
            console.log(
              `171 ${`\u001b[${33}m${`config.rules`}\u001b[${39}m`} = ${JSON.stringify(
                config.rules,
                null,
                4
              )}`
            );

            // check, is rule enabled at the first place:
            const currentRulesSeverity = isAnEnabledRule(
              config.rules,
              obj.ruleId
            );
            if (currentRulesSeverity) {
              let message = `Something is wrong.`;

              if (
                isObj(obj) &&
                Object.keys(astErrMessages).includes(obj.ruleId)
              ) {
                message = astErrMessages[obj.ruleId];
              }

              console.log(
                `194 ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`} "${message}"`
              );
              this.report(
                Object.assign(
                  {
                    message,
                    severity: currentRulesSeverity,
                    fix: null
                  },
                  obj
                )
              );
            }
          }
        }),
        // (key, val, innerObj, stop) => {
        (key, val) => {
          const current = val !== undefined ? val : key;
          if (isObj(current)) {
            // monkey will traverse every key, every string within.
            // We need to pick the objects of a type we need: "tag", "comment" etc.

            // tag-level callback
            // console.log(
            //   `210 ██ ${`\u001b[${35}m${`linter/tagCb():`}\u001b[${39}m`} PING ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
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
              current.attribs.forEach(attribObj => {
                this.emit(
                  "attribute",
                  Object.assign({}, attribObj, {
                    parent: Object.assign({}, current)
                  })
                );
              });
            }
          }
          return current;
        }
      )
    );

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
    if (
      Object.keys(config.rules).some(
        ruleName =>
          (ruleName === "all" || // group blanket setting
          ruleName === "bad-html-entity" || // group blanket setting
            ruleName.startsWith("bad-html-entity") ||
            ruleName.startsWith("bad-named-html-entity") ||
            matcher.isMatch(
              ["bad-malformed-numeric-character-entity"],
              ruleName
            )) &&
          (isAnEnabledValue(config.rules[ruleName]) ||
            isAnEnabledValue(processedRulesConfig[ruleName]))
      )
    ) {
      console.log(`276 linter.js: call stringFixBrokenNamedEntities()`);
      stringFixBrokenNamedEntities(str, {
        cb: obj => {
          console.log(
            `280 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
              obj,
              null,
              4
            )}`
          );
          // evaluate, does the config have this emitted rule set and enabled
          let matchedRulesName;

          // A severity value can be under array's first element or as digit,
          // plus rule itself might be group rule ("bad-html-entity") or
          // mentioned directly.
          // The plan is to try to extract severity various ways, later if it's
          // set, then report the error.
          let severity;

          // rule is group, blanket rule
          if (Object.keys(config.rules).includes("bad-html-entity")) {
            if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              // unrecongnised named HTML entities might be false positives,
              // mix of ampersand, letters and semicolon, without spaces,
              // so default level is "warning", not "error":
              severity = 1;
            } else if (Array.isArray(config.rules["bad-html-entity"])) {
              severity = config.rules["bad-html-entity"][0];
            } else if (Number.isInteger(config.rules["bad-html-entity"])) {
              severity = config.rules["bad-html-entity"];
            }
          } else if (
            Object.keys(config.rules).some(rulesName => {
              console.log(
                `${`\u001b[${36}m${`--- rulesName: ${rulesName}`}\u001b[${39}m`}`
              );
              if (matcher.isMatch(obj.ruleName, rulesName)) {
                matchedRulesName = rulesName;
                console.log(
                  `${`\u001b[${36}m${`"${rulesName}" matched!`}\u001b[${39}m`}`
                );

                return true;
              }
            })
          ) {
            if (
              obj.ruleName === "bad-named-html-entity-unrecognised" &&
              config.rules["bad-named-html-entity-unrecognised"] === undefined
            ) {
              // unless the rule was requested exactly, severity is 1.
              // This applies to both group blanket rules "bad-html-entity" and
              // any rules achieved by applying wildcards, for example,
              // "bad-named-html-entity-*".
              severity = 1;
            } else if (Array.isArray(config.rules[matchedRulesName])) {
              severity = config.rules[matchedRulesName][0];
            } else if (Number.isInteger(config.rules[matchedRulesName])) {
              severity = config.rules[matchedRulesName];
            }
          }

          if (Number.isInteger(severity)) {
            let message;
            if (obj.ruleName === "bad-named-html-entity-malformed-nbsp") {
              message = "Malformed NBSP entity.";
            } else if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              message = "Unrecognised named entity.";
            } else if (
              obj.ruleName === "bad-named-html-entity-multiple-encoding"
            ) {
              message = "HTML entity encoding over and over.";
            } else if (
              obj.ruleName === "bad-malformed-numeric-character-entity"
            ) {
              message = "Malformed numeric entity.";
            } else {
              message = `Malformed ${
                obj.entityName ? obj.entityName : "named"
              } entity.`;
            }

            let ranges = [
              [
                obj.rangeFrom,
                obj.rangeTo,
                obj.rangeValEncoded ? obj.rangeValEncoded : ""
              ]
            ];
            if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              ranges = [];
            }

            this.report({
              severity,
              ruleId: obj.ruleName,
              message,
              idxFrom: obj.rangeFrom,
              idxTo: obj.rangeTo,
              fix: {
                ranges
              }
            });
          }
        },
        entityCatcherCb: (from, to) => {
          console.log(
            `384 linter.js: entityCatcher pinging { from: ${from}, to: ${to} }`
          );
          this.emit("entity", { idxFrom: from, idxTo: to });
        }
      });
    }

    // remove all listeners
    ["tag", "at", "rule", "text", "esp", "character", "ast"].forEach(
      eventName => {
        this.removeAllListeners(eventName);
      }
    );

    console.log(
      `399 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify() final return is called;\nthis.messages=${JSON.stringify(
        this.messages,
        null,
        4
      )}`
    );
    return this.messages;
  }

  report(obj) {
    console.log(
      `410 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: report() called with ${JSON.stringify(
        obj,
        null,
        4
      )}`
    );
    // fill in other data points:
    const { line, col } = lineColumn(this.str, obj.idxFrom);
    let severity = obj.severity; // rules coming from 3rd party packages will give the severity value
    console.log(
      `420 linter.js: ${`\u001b[${33}m${`this.processedRulesConfig[obj.ruleId]`}\u001b[${39}m`} = ${JSON.stringify(
        this.processedRulesConfig[obj.ruleId],
        null,
        4
      )}`
    );
    if (
      !Number.isInteger(obj.severity) &&
      typeof this.processedRulesConfig[obj.ruleId] === "number"
    ) {
      severity = this.processedRulesConfig[obj.ruleId];
    } else if (
      !Number.isInteger(obj.severity) &&
      Array.isArray(this.processedRulesConfig[obj.ruleId])
    ) {
      severity = this.processedRulesConfig[obj.ruleId][0];
    }
    console.log(
      `438 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: line = ${line}; column = ${col}`
    );
    console.log(
      `${`\u001b[${33}m${`this.messages`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
        this.messages,
        null,
        4
      )}`
    );
    this.messages.push(Object.assign({}, { line, column: col, severity }, obj));
    console.log(
      `${`\u001b[${33}m${`this.messages`}\u001b[${39}m`} AFTER: ${JSON.stringify(
        this.messages,
        null,
        4
      )}`
    );
  }
}

export { Linter };
