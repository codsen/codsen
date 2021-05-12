import { Linter, RuleObjType } from "../../linter";
import { left } from "string-left-right";
// import { Attrib } from "../../util/commonTypes";

// rule: tag-malformed
// checks brackets etc
// -----------------------------------------------------------------------------

function tagMalformed(context: Linter): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagMalformed() ███████████████████████████████████████`
      );
      // check the opening bracket
      if (context.str[node.start] !== "<") {
        console.log(
          `018 ${`\u001b[${31}m${`opening bracket missing`}\u001b[${39}m`}`
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
        console.log(
          `032 ${`\u001b[${31}m${`closing bracket missing`}\u001b[${39}m`}`
        );
        const startPos = (left(context.str, node.end) as number) + 1;
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
