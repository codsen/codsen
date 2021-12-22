import { matcher } from "matcher";

import { Linter, RuleObjType } from "../../linter";

// rule: tag-is-present
// -----------------------------------------------------------------------------

// it flags up any tags from the blacklist

function tagIsPresent(context: Linter, ...blacklist: string[]): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagIsPresent() ███████████████████████████████████████`
      );
      console.log(
        `017 tagIsPresent(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (Array.isArray(blacklist) && blacklist.length) {
        let temp = matcher([node.tagName], blacklist);
        console.log(
          `023 ${`\u001b[${33}m${`matcher([${JSON.stringify(
            node.tagName,
            null,
            0
          )}], ${JSON.stringify(
            blacklist,
            null,
            0
          )})`}\u001b[${39}m`} = ${JSON.stringify(temp, null, 4)}`
        );
        if (matcher([node.tagName], blacklist).length) {
          console.log(`034 RAISE ERROR [${node.start}, ${node.end}]`);
          context.report({
            ruleId: "tag-is-present",
            message: `${node.tagName} is not allowed.`,
            idxFrom: node.start,
            idxTo: node.end, // second elem. from last range
            fix: { ranges: [[node.start, node.end]] },
          });
        }
      }
    },
  };
}

export default tagIsPresent;
