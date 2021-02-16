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
        `048 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`properties`}\u001b[${39}m`} = ${JSON.stringify(
          properties as any,
          null,
          4
        )}`
      );

      if (properties && properties.length > 1) {
        for (let i = properties.length - 1; i--; ) {
          if (properties[i].semi === null) {
            console.log(
              `059 ${`\u001b[${31}m${`missing semi on ${properties[i].property}`}\u001b[${39}m`}`
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
          `088 ${`\u001b[${31}m${`something rogue inside ${node.value}`}\u001b[${39}m`}`
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
    },
  };
};

export default cssRuleMalformed;
