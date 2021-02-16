import { Linter, RuleObjType } from "../../linter";
import { Property } from "../../../../codsen-tokenizer/src/util/util";
// import { Range } from "../../../../../scripts/common";

// rule: trailing-semi
// -----------------------------------------------------------------------------

// import { rMerge } from "ranges-merge";
// import { right } from "string-left-right";
// import splitByWhitespace from "../../util/splitByWhitespace";

type Mode = "always" | "never";
interface cssRuleMalformed {
  (context: Linter, mode: Mode): RuleObjType;
}
const cssRuleMalformed: cssRuleMalformed = (context, mode) => {
  return {
    rule(node) {
      console.log(
        `███████████████████████████████████████ cssRuleMalformed() ███████████████████████████████████████`
      );
      console.log(`022 mode = ${JSON.stringify(mode, null, 4)}`);
      console.log(
        `024 cssRuleMalformed(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      let properties: Property[] = [];
      // there can be text nodes within properties array!
      // innocent whitespace is still a text node!!!!
      if (
        Array.isArray(node.properties) &&
        node.properties.length &&
        node.properties.filter((property) => (property as any).property).length
      ) {
        properties = node.properties.filter(
          (property) => (property as any).property
        ) as Property[];
      }
      console.log(
        `044 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`properties`}\u001b[${39}m`} = ${JSON.stringify(
          properties as any,
          null,
          4
        )}`
      );

      if (properties.length > 1) {
        for (let i = properties.length - 1; i--; ) {
          if (properties[i].semi === null) {
            console.log(
              `055 ${`\u001b[${31}m${`missing semi on ${properties[i].property}`}\u001b[${39}m`}`
            );
            context.report({
              ruleId: "css-rule-malformed",
              idxFrom: properties[i].start,
              idxTo: properties[i].end,
              message: `Add a semicolon.`,
              fix: {
                ranges: [[properties[i].end, properties[i].end, ";"]],
              },
            });
          }
        }
      }
    },
  };
};

export default cssRuleMalformed;
