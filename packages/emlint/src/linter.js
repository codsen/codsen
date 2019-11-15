import tokenizer from "codsen-tokenizer";
import { get } from "./rules.js";
import EventEmitter from "events";
import lineColumn from "line-column";

class Linter extends EventEmitter {
  verify(str, config) {
    this.messages = [];
    this.str = str;
    this.config = config;

    console.log(
      `013 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify called for "${str}" and ${JSON.stringify(
        config,
        null,
        4
      )}`
    );

    // filter out all applicable values and make them listen for events that
    // tokenizer emits
    Object.keys(config.rules)
      .filter(ruleName => {
        // same config like in ESLint - 0 is off, 1 is warning, 2 is error
        if (typeof config.rules[ruleName] === "number") {
          return config.rules[ruleName] > 0;
        } else if (Array.isArray(config.rules[ruleName])) {
          return config.rules[ruleName][0] > 0;
        }
      })
      .forEach(rule => {
        console.log(
          `033 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: filtering rule ${rule}`
        );
        // extract all the options, second array element onwards - length is undertermined
        let rulesFunction;
        if (
          Array.isArray(config.rules[rule]) &&
          config.rules[rule].length > 1
        ) {
          // pass not only "this", the context, but also all the opts, as args
          rulesFunction = get(rule)(this, ...config.rules[rule].slice(1));
        } else {
          // just pass "this", the context
          rulesFunction = get(rule)(this);
        }
        Object.keys(rulesFunction).forEach(consumedNode => {
          this.on(consumedNode, (...args) => {
            console.log(
              `050 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`consumedNode`}\u001b[${39}m`} = ${JSON.stringify(
                consumedNode,
                null,
                4
              )}`
            );
            rulesFunction[consumedNode](...args);
          });
        });
      });

    // CHARACTER-LEVEL.
    // ping every single character in the input to character listener plugins
    const len = str.length;
    for (let i = 0; i < len; i++) {
      this.emit("character", str[i], i);
    }

    // TAG-LEVEL.
    // tokenizer emits the objects, rules consume them
    tokenizer(str, obj => {
      console.log(
        `072 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: emitting ${JSON.stringify(
          obj,
          null,
          4
        )}`
      );
      this.emit(obj.type, obj);
    });
    console.log(
      `081 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify() final return is called.`
    );
    return this.messages;
  }

  report(obj) {
    console.log(
      `088 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: report() called with ${JSON.stringify(
        obj,
        null,
        4
      )}`
    );
    // fill in other data points:
    const { line, col } = lineColumn(this.str, obj.idxFrom);
    let severity;
    if (typeof this.config.rules[obj.ruleId] === "number") {
      severity = this.config.rules[obj.ruleId];
    } else {
      severity = this.config.rules[obj.ruleId][0];
    }
    console.log(
      `103 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: line = ${line}; column = ${col}`
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
