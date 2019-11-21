import tokenizer from "codsen-tokenizer";
import { get, normaliseRequestedRules } from "./rules.js";
import EventEmitter from "events";
import lineColumn from "line-column";
import stringFixBrokenNamedEntities from "string-fix-broken-named-entities";
import allBadNamedHTMLEntityRules from "./rules/all-bad-named-html-entity.json";
import matcher from "matcher";

class Linter extends EventEmitter {
  verify(str, config) {
    this.messages = [];
    this.str = str;
    this.config = config;

    console.log(
      `016 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify called for "${str}" and ${JSON.stringify(
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
      `054 ${`\u001b[${33}m${`processedRulesConfig`}\u001b[${39}m`} = ${JSON.stringify(
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
      .filter(
        ruleName =>
          !allBadNamedHTMLEntityRules.includes(ruleName) &&
          !ruleName.startsWith("bad-named-html-entity-") &&
          (!ruleName.includes("*") ||
            !matcher.isMatch(
              [
                "bad-malformed-numeric-character-entity",
                "encoded-html-entity-nbsp",
                "encoded-numeric-html-entity-reference"
              ],
              ruleName
            ))
      )
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
        console.log(
          `091 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: filtering rule ${rule}`
        );
        // extract all the options, second array element onwards - length is undertermined
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
            console.log(
              `111 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`consumedNode`}\u001b[${39}m`} = ${JSON.stringify(
                consumedNode,
                null,
                4
              )}`
            );
            rulesFunction[consumedNode](...args);
          });
        });
      });

    // tokenizer emits the objects, rules consume them
    tokenizer(
      str,
      obj => {
        // tag-level callback
        // console.log(
        //   `128 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: emitting tag obj ${JSON.stringify(
        //     obj,
        //     null,
        //     4
        //   )}`
        // );
        this.emit(obj.type, obj);
      },
      obj => {
        // character-level callback
        // console.log(
        //   `139 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: emitting char obj ${JSON.stringify(
        //     obj,
        //     null,
        //     4
        //   )}`
        // );
        this.emit("character", obj);
      }
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
          (ruleName === "bad-html-entity" || // group blanket setting
            ruleName.startsWith("bad-named-html-entity") ||
            matcher.isMatch(
              [
                "bad-malformed-numeric-character-entity",
                "encoded-html-entity-nbsp",
                "encoded-numeric-html-entity-reference"
              ],
              ruleName
            )) &&
          // that rule is enabled
          ((Number.isInteger(config.rules[ruleName]) &&
            config.rules[ruleName] > 0) ||
            (Array.isArray(config.rules[ruleName]) &&
              Number.isInteger(config.rules[ruleName][0]) &&
              config.rules[ruleName][0] > 0))
      )
    ) {
      console.log(`185 linter.js: call stringFixBrokenNamedEntities()`);
      stringFixBrokenNamedEntities(str, {
        cb: obj => {
          console.log(
            `189 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
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
        }
      });
    }

    console.log(
      `295 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify() final return is called.`
    );
    return this.messages;
  }

  report(obj) {
    console.log(
      `302 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: report() called with ${JSON.stringify(
        obj,
        null,
        4
      )}`
    );
    // fill in other data points:
    const { line, col } = lineColumn(this.str, obj.idxFrom);
    let severity = obj.severity; // rules coming from 3rd party packages will give the severity value
    console.log(
      `312 linter.js: ${`\u001b[${33}m${`this.processedRulesConfig[obj.ruleId]`}\u001b[${39}m`} = ${JSON.stringify(
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
    } else if (!Number.isInteger(obj.severity)) {
      severity = this.processedRulesConfig[obj.ruleId][0];
    }
    console.log(
      `327 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: line = ${line}; column = ${col}`
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
