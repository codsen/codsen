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
      // check closing bracket
      if (context.str[node.end - 1] !== ">") {
        console.log(
          `018 ${`\u001b[${31}m${`closing bracket missing`}\u001b[${39}m`}`
        );
        const startPos = (left(context.str, node.end) as number) + 1;
        context.report({
          ruleId: "tag-malformed",
          message: "Add a closing bracket.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: { ranges: [[startPos, startPos, ">"]] },
        });
      }
    },
  };
}

export default tagMalformed;
