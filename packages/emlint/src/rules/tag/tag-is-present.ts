import { matcher } from "matcher";

import { Linter, RuleObjType } from "../../linter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: tag-is-present
// -----------------------------------------------------------------------------

// it flags up any tags from the blacklist

function tagIsPresent(context: Linter, ...blacklist: string[]): RuleObjType {
  return {
    tag(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ tagIsPresent() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `022 tagIsPresent(): node = ${JSON.stringify(node, null, 4)}`
        );

      if (Array.isArray(blacklist) && blacklist.length) {
        let temp = matcher([node.tagName], blacklist);
        DEV &&
          console.log(
            `029 ${`\u001b[${33}m${`matcher([${JSON.stringify(
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
          DEV && console.log(`040 RAISE ERROR [${node.start}, ${node.end}]`);
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
