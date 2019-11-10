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
        const rulesFunction = get(rule)(this);
        Object.keys(rulesFunction).forEach(consumedNode => {
          this.on(consumedNode, receivedFromTokenizer => {
            console.log(
              `039 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: ${`\u001b[${33}m${`consumedNode`}\u001b[${39}m`} = ${JSON.stringify(
                consumedNode,
                null,
                4
              )}`
            );
            rulesFunction[consumedNode](receivedFromTokenizer);
          });
        });
      });

    // tokenizer emits the objects, rules consume them
    tokenizer(str, obj => {
      console.log(
        `053 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: emitting ${JSON.stringify(
          obj,
          null,
          4
        )}`
      );
      this.emit(obj.type, obj);
    });
    console.log(
      `062 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: verify() final return is called.`
    );
    return this.messages;
  }

  report(obj) {
    console.log(
      `069 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: report() called with ${JSON.stringify(
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
      `084 ${`\u001b[${32}m${`linter.js`}\u001b[${39}m`}: line = ${line}; column = ${col}`
    );
    this.messages.push(Object.assign({}, { line, column: col, severity }, obj));
  }
}

export { Linter };
