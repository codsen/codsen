// rule: tag-space-after-opening-bracket
// -----------------------------------------------------------------------------

import { left, right } from "string-left-right";

// it flags up any tags which have whitespace between opening bracket and first
// tag name letter:
//
// < table>
// <   a href="">
// <\n\nspan>

function tagSpaceAfterOpeningBracket(context) {
  return {
    html: function(node) {
      console.log(
        `███████████████████████████████████████ tagSpaceAfterOpeningBracket() ███████████████████████████████████████`
      );
      console.log(`node = ${JSON.stringify(node, null, 4)}`);
      const ranges = [];
      // const wholeGap = context.str.slice(node.start + 1, node.tagNameStartAt);

      // 1. if there's whitespace after opening bracket
      if (
        typeof context.str[node.start + 1] === "string" &&
        !context.str[node.start + 1].trim().length
      ) {
        console.log(`029 whitespace after opening bracket confirmed`);
        ranges.push([node.start + 1, right(context.str, node.start + 1)]);
      }

      // 2. if there's whitespace before tag name
      if (!context.str[node.tagNameStartAt - 1].trim().length) {
        console.log(`035 whitespace before tag name confirmed`);
        const charToTheLeftOfTagNameIdx = left(
          context.str,
          node.tagNameStartAt
        );
        if (charToTheLeftOfTagNameIdx !== node.start) {
          // we don't want duplication
          ranges.push([charToTheLeftOfTagNameIdx + 1, node.tagNameStartAt]);
        }
      }

      if (ranges.length) {
        context.report({
          ruleId: "tag-space-after-opening-bracket",
          message: "Bad whitespace.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1], // second elem. from last range
          fix: { ranges }
        });
      }
    }
  };
}

export default tagSpaceAfterOpeningBracket;
