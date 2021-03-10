import { Linter, RuleObjType } from "../../linter";
import { left } from "string-left-right";
const BACKSLASH = "\u005C";

// rule: tag-space-between-slash-and-bracket
// -----------------------------------------------------------------------------

function tagSpaceBetweenSlashAndBracket(context: Linter): RuleObjType {
  return {
    tag(node) {
      // since we know the location of the closing bracket,
      // let's look to the left, is there a slash and check the distance

      const idxOnTheLeft = left(context.str, node.end - 1) as number;
      if (
        Number.isInteger(node.end) &&
        context.str[node.end - 1] === ">" && // necessary because in the future unclosed tags will be recognised!
        (context.str[idxOnTheLeft] === "/" ||
          context.str[idxOnTheLeft] === BACKSLASH) &&
        idxOnTheLeft < node.end - 2
      ) {
        const idxFrom = idxOnTheLeft + 1;
        console.log(`023 whitespace present between slash and bracket!`);
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
