import { Linter, RuleObjType } from "../../linter";
import { Ranges } from "../../../../../scripts/common";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: tag-name-case
// -----------------------------------------------------------------------------

function tagNameCase(context: Linter): RuleObjType {
  let knownUpperCaseTags = ["CDATA"];
  let variableCaseTagNames = ["doctype"];
  return {
    tag(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ tagNameCase() ███████████████████████████████████████`
        );
      // since we know the location of the closing bracket,
      // let's look to the left, is there a slash and check the distance
      DEV &&
        console.log(
          `${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.tagName && node.recognised === true) {
        DEV && console.log(`031 tagNameCase(): recognised tag`);

        DEV &&
          console.log(
            `035 tagNameCase(): ${`\u001b[${33}m${`knownUpperCaseTags.includes(node.tagName.toUpperCase())`}\u001b[${39}m`} = ${JSON.stringify(
              knownUpperCaseTags.includes(node.tagName.toUpperCase()),
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `043 tagNameCase(): ${`\u001b[${33}m${`node.tagName`}\u001b[${39}m`} = ${JSON.stringify(
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
            DEV && console.log(`057 tagNameCase(): wrong tag case!`);
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
          DEV && console.log(`080 tagNameCase(): wrong tag case!`);
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
