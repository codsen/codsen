import { Linter, RuleObjType } from "../../linter";
import { Ranges } from "../../../../../scripts/common";

// rule: tag-name-case
// -----------------------------------------------------------------------------

function tagNameCase(context: Linter): RuleObjType {
  let knownUpperCaseTags = ["CDATA"];
  let variableCaseTagNames = ["doctype"];
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagNameCase() ███████████████████████████████████████`
      );
      // since we know the location of the closing bracket,
      // let's look to the left, is there a slash and check the distance
      console.log(
        `${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.tagName && node.recognised === true) {
        console.log(`026 tagNameCase(): recognised tag`);

        console.log(
          `029 tagNameCase(): ${`\u001b[${33}m${`knownUpperCaseTags.includes(node.tagName.toUpperCase())`}\u001b[${39}m`} = ${JSON.stringify(
            knownUpperCaseTags.includes(node.tagName.toUpperCase()),
            null,
            4
          )}`
        );
        console.log(
          `036 tagNameCase(): ${`\u001b[${33}m${`node.tagName`}\u001b[${39}m`} = ${JSON.stringify(
            node.tagName,
            null,
            4
          )}`
        );

        if (knownUpperCaseTags.includes(node.tagName.toUpperCase())) {
          // node.tagName will arrive lowercased, so we have to retrieve
          // the real characters by slicing from ranges
          if (
            context.str.slice(node.tagNameStartsAt, node.tagNameEndsAt) !==
            node.tagName.toUpperCase()
          ) {
            console.log(`050 tagNameCase(): wrong tag case!`);
            let ranges: Ranges = [
              [
                node.tagNameStartsAt,
                node.tagNameEndsAt,
                node.tagName.toUpperCase(),
              ],
            ];

            context.report({
              ruleId: "tag-name-case",
              message: "Bad tag name case.",
              idxFrom: node.tagNameStartsAt,
              idxTo: node.tagNameEndsAt,
              fix: { ranges },
            });
          }
          // else - FINE
        } else if (
          context.str.slice(node.tagNameStartsAt, node.tagNameEndsAt) !==
            node.tagName &&
          !variableCaseTagNames.includes(node.tagName.toLowerCase())
        ) {
          console.log(`073 tagNameCase(): wrong tag case!`);
          let ranges: Ranges = [
            [node.tagNameStartsAt, node.tagNameEndsAt, node.tagName],
          ];

          context.report({
            ruleId: "tag-name-case",
            message: "Bad tag name case.",
            idxFrom: node.tagNameStartsAt,
            idxTo: node.tagNameEndsAt,
            fix: { ranges },
          });
        }
      }
    },
  };
}

export default tagNameCase;
