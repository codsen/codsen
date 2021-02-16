import { Linter, RuleObjType } from "../../linter";
import { Property } from "../../../../codsen-tokenizer/src/util/util";
// import { Range } from "../../../../../scripts/common";

// rule: trailing-semi
// -----------------------------------------------------------------------------

// import { rMerge } from "ranges-merge";
// import { right } from "string-left-right";
// import splitByWhitespace from "../../util/splitByWhitespace";

interface cssRuleMalformed {
  (context: Linter): RuleObjType;
}
const cssRuleMalformed: cssRuleMalformed = (context) => {
  return {
    rule(node) {
      console.log(
        `███████████████████████████████████████ cssRuleMalformed() ███████████████████████████████████████`
      );
      console.log(
        `022 cssRuleMalformed(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      // 1. catch rules with semicolons missing:
      // <style>.a{color:red\n\ntext-align:left
      //                    ^

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
        `046 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`properties`}\u001b[${39}m`} = ${JSON.stringify(
          properties as any,
          null,
          4
        )}`
      );

      if (properties && properties.length > 1) {
        for (let i = properties.length - 1; i--; ) {
          if (properties[i].semi === null && properties[i].value) {
            console.log(
              `057 ${`\u001b[${31}m${`missing semi on ${properties[i].property}`}\u001b[${39}m`}`
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

      // 2. catch css rules with selectors but without properties
      // <style>.a{;}
      //           ^

      if (
        Array.isArray(node.selectors) &&
        node.selectors.length &&
        !properties.length &&
        node.openingCurlyAt &&
        node.closingCurlyAt &&
        node.closingCurlyAt > node.openingCurlyAt + 1 &&
        context.str.slice(node.openingCurlyAt + 1, node.closingCurlyAt).trim()
      ) {
        console.log(
          `086 ${`\u001b[${31}m${`something rogue inside ${node.value}`}\u001b[${39}m`}`
        );
        context.report({
          ruleId: "css-rule-malformed",
          idxFrom: node.start,
          idxTo: node.end,
          message: `Delete rogue character${
            context.str
              .slice(node.openingCurlyAt + 1, node.closingCurlyAt)
              .trim().length > 1
              ? "s"
              : ""
          }.`,
          fix: {
            ranges: [[node.openingCurlyAt + 1, node.closingCurlyAt]],
          },
        });
      }

      // 3. catch css properties without values
      // <style>.a{color:}</style>
      //                ^

      if (properties && properties.length) {
        properties.forEach((property) => {
          if (property.value === null) {
            console.log(
              `113 ${`\u001b[${31}m${`missing value on ${property.property}`}\u001b[${39}m`}`
            );
            context.report({
              ruleId: "css-rule-malformed",
              idxFrom: property.start,
              idxTo: property.end,
              message: `Missing value.`,
              fix: null,
            });
          }
        });
      }
    },
  };
};

export default cssRuleMalformed;
