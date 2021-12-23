import { left } from "string-left-right";

import { Linter, RuleObjType } from "../../linter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;
// import { Attrib } from "../../util/commonTypes";

// rule: tag-malformed
// checks brackets etc
// -----------------------------------------------------------------------------

function tagMalformed(context: Linter): RuleObjType {
  return {
    tag(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ tagMalformed() ███████████████████████████████████████`
        );
      // check the opening bracket
      if (context.str[node.start] !== "<") {
        DEV &&
          console.log(
            `024 ${`\u001b[${31}m${`opening bracket missing`}\u001b[${39}m`}`
          );
        context.report({
          ruleId: "tag-malformed",
          message: "Add an opening bracket.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: { ranges: [[node.start, node.start, "<"]] },
        });
      }

      // check the closing bracket
      if (context.str[node.end - 1] !== ">") {
        DEV &&
          console.log(
            `039 ${`\u001b[${31}m${`closing bracket missing`}\u001b[${39}m`}`
          );
        let startPos = (left(context.str, node.end) as number) + 1;
        let extras = "";
        if (node.void) {
          extras = " /";
        }
        context.report({
          ruleId: "tag-malformed",
          message: "Add a closing bracket.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: { ranges: [[startPos, startPos, `${extras}>`]] },
        });
      }
    },
  };
}

export default tagMalformed;
