import { Linter, RuleObjType } from "../../linter";
import { left } from "string-left-right";

// rule: tag-space-between-slash-and-bracket
// -----------------------------------------------------------------------------

// it flags up any tags which have whitespace between opening bracket and first
// tag name letter:
//
// < table>
// <   a href="">
// <\n\nspan>

function tagSpaceBetweenSlashAndBracket(context: Linter): RuleObjType {
  return {
    tag(node) {
      // since we know the location of the closing bracket,
      // let's look to the left, is there a slash and check the distance
      if (
        Number.isInteger(node.end) &&
        context.str[node.end - 1] === ">" && // necessary because in the future unclosed tags will be recognised!
        context.str[left(context.str, node.end - 1) as number] === "/" &&
        (left(context.str, node.end - 1) as number) < node.end - 2
      ) {
        const idxFrom = (left(context.str, node.end - 1) as number) + 1;
        console.log(`026 whitespace present between slash and bracket!`);
        context.report({
          ruleId: "tag-space-between-slash-and-bracket",
          message: "Bad whitespace.",
          idxFrom,
          idxTo: node.end - 1,
          fix: { ranges: [[idxFrom, node.end - 1]] },
        });
      }
    },
  };
}

export default tagSpaceBetweenSlashAndBracket;
