import tokenizer from "codsen-tokenizer";
import { get, normaliseRequestedRules } from "./rules.js";
import EventEmitter from "events";
import lineColumn from "line-column";
import stringFixBrokenNamedEntities from "string-fix-broken-named-entities";
import allBadNamedHTMLEntityRules from "./rules/all-bad-named-html-entity.json";

class Linter extends EventEmitter {
  verify(str, config) {
    this.messages = [];
    this.str = str;
    this.config = config;

    console.log(
      `015 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify called for "${str}" and ${JSON.stringify(
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
      `053 ${`\u001b[${33}m${`processedRulesConfig`}\u001b[${39}m`} = ${JSON.stringify(
        processedRulesConfig,
        null,
        4
      )}`
    );
    this.processedRulesConfig = processedRulesConfig;

    Object.keys(processedRulesConfig)
      // filter out the rules coming from external packages:
      .filter(ruleName => !allBadNamedHTMLEntityRules.includes(ruleName))
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
          `075 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: filtering rule ${rule}`
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
              `095 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`consumedNode`}\u001b[${39}m`} = ${JSON.stringify(
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
        //   `112 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: emitting tag obj ${JSON.stringify(
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
        //   `123 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: emitting char obj ${JSON.stringify(
        //     obj,
        //     null,
        //     4
        //   )}`
        // );
        this.emit("character", obj);
      }
    );

    // rules coming from standalone packages
    if (
      Object.keys(processedRulesConfig).some(ruleName =>
        ruleName.startsWith("bad-named-html-entity-")
      )
    ) {
      // call stringFixBrokenNamedEntities()
      stringFixBrokenNamedEntities(str, {
        cb: obj => {
          console.log(
            `143 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
              obj,
              null,
              4
            )}`
          );
        }
      });
    }

    console.log(
      `154 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify() final return is called.`
    );
    return this.messages;
  }

  report(obj) {
    console.log(
      `161 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: report() called with ${JSON.stringify(
        obj,
        null,
        4
      )}`
    );
    // fill in other data points:
    const { line, col } = lineColumn(this.str, obj.idxFrom);
    let severity;
    console.log(
      `171 linter.js: ${`\u001b[${33}m${`this.processedRulesConfig[obj.ruleId]`}\u001b[${39}m`} = ${JSON.stringify(
        this.processedRulesConfig[obj.ruleId],
        null,
        4
      )}`
    );
    if (typeof this.processedRulesConfig[obj.ruleId] === "number") {
      severity = this.processedRulesConfig[obj.ruleId];
    } else {
      severity = this.processedRulesConfig[obj.ruleId][0];
    }
    console.log(
      `183 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: line = ${line}; column = ${col}`
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
