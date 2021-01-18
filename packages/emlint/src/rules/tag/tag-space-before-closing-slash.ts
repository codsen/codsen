import { Linter, RuleObjType } from "../../linter";
import { left } from "string-left-right";

// rule: tag-space-before-closing-slash
// -----------------------------------------------------------------------------

// it flags up any tags which have whitespace between opening bracket and first
// tag name letter:
//
// < table>
// <   a href="">
// <\n\nspan>

function tagSpaceBeforeClosingSlash(
  context: Linter,
  mode: "always" | "never" = "never"
): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagSpaceBeforeClosingSlash() ███████████████████████████████████████`
      );
      console.log(`019 inside rule: node = ${JSON.stringify(node, null, 4)}`);
      const gapValue = context.str.slice(node.start + 1, node.tagNameStartsAt);
      console.log(`021 gapValue = ${JSON.stringify(gapValue, null, 4)}`);

      console.log(
        `024 tagSpaceBeforeClosingSlash(): ${`\u001b[${33}m${`context.str[${node.tagNameStartsAt}]`}\u001b[${39}m`} = ${JSON.stringify(
          context.str[node.tagNameStartsAt],
          null,
          4
        )}`
      );
      console.log(
        `037 tagSpaceBeforeClosingSlash(): ${`\u001b[${33}m${`mode`}\u001b[${39}m`} = ${JSON.stringify(
          mode,
          null,
          4
        )}`
      );

      // PROCESSING:
      const closingBracketPos = node.end - 1;
      const slashPos = left(context.str, closingBracketPos) as number;
      const leftOfSlashPos = left(context.str, slashPos) || 0;
      if (
        mode === "never" &&
        node.void &&
        context.str[slashPos as number] === "/" &&
        leftOfSlashPos < (slashPos as number) - 1
      ) {
        console.log(`058 whitespace present in front of closing slash!`);
        context.report({
          ruleId: "tag-space-before-closing-slash",
          message: "Bad whitespace.",
          idxFrom: leftOfSlashPos + 1,
          idxTo: slashPos,
          fix: { ranges: [[leftOfSlashPos + 1, slashPos]] },
        });
      } else if (
        mode === "always" &&
        node.void &&
        context.str[slashPos] === "/" &&
        leftOfSlashPos === slashPos - 1
      ) {
        console.log(`072 space missing in front of closing slash!`);
        context.report({
          ruleId: "tag-space-before-closing-slash",
          message: "Missing space.",
          idxFrom: slashPos,
          idxTo: slashPos,
          fix: { ranges: [[slashPos, slashPos, " "]] },
        });
      }
    },
  };
}

export default tagSpaceBeforeClosingSlash;
