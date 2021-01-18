import { Linter, RuleObjType } from "../../linter";
import { Ranges } from "../../../../../scripts/common";
import { left } from "string-left-right";

// rule: tag-space-before-closing-bracket
// -----------------------------------------------------------------------------

const BACKSLASH = "\u005C";

// it flags up any tags which have whitespace between opening bracket and first
// tag name letter:
//
// < table>
// <   a href="">
// <\n\nspan>

function tagSpaceBeforeClosingBracket(context: Linter): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagSpaceBeforeClosingBracket() ███████████████████████████████████████`
      );
      console.log(`node = ${JSON.stringify(node, null, 4)}`);
      const ranges: Ranges = [];
      // const wholeGap = context.str.slice(node.start + 1, node.tagNameStartsAt);

      // 1. if there's whitespace before the closing bracket
      if (
        // tag ends with a bracket:
        context.str[node.end - 1] === ">" &&
        // and there's a whitespace on the left of it:
        !context.str[node.end - 2].trim().length &&
        // and the next non-whitespace character on the left is not slash of
        // any kind (we don't want to step into rule's
        // "tag-space-between-slash-and-bracket" turf)
        !`${BACKSLASH}/`.includes(
          context.str[left(context.str, node.end - 1) || 0]
        )
      ) {
        const from = left(context.str, node.end - 1)
          ? (left(context.str, node.end - 1) as number) + 1
          : 0;
        console.log(`036 whitespace before closing bracket confirmed`);
        console.log(`038 PUSH [${from}, ${node.end - 1}]`);
        ranges.push([from, node.end - 1]);
      }

      if (ranges.length) {
        context.report({
          ruleId: "tag-space-before-closing-bracket",
          message: "Bad whitespace.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1], // second elem. from last range
          fix: { ranges },
        });
      }
    },
  };
}

export default tagSpaceBeforeClosingBracket;
