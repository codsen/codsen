import { left } from "string-left-right";

import { Linter, RuleObjType } from "../../linter";
import { isAnEnabledValue } from "../../util/util";

// rule: tag-space-before-closing-bracket
// -----------------------------------------------------------------------------

const BACKSLASH = "\u005C";

function tagSpaceBeforeClosingBracket(
  context: Linter,
  mode: "always" | "never" = "never"
): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagSpaceBeforeClosingBracket() ███████████████████████████████████████`
      );
      console.log(`mode = ${JSON.stringify(mode, null, 4)}`);
      console.log(`node = ${JSON.stringify(node, null, 4)}`);

      // -----------------------------------------------------------------------------
      // early exit

      // if there's no closing bracket, exit early
      if (context.str[node.end - 1] !== ">") {
        console.log(`028 EXIT, there's no closing bracket`);
        return;
      }

      // -----------------------------------------------------------------------------
      // preparations

      // calculate the "leftmostPos" - that's slash if present or bracket
      // <br />
      //     ^
      //
      // <br /   >
      //     ^
      //
      // <div class="">
      //              ^

      // "leftmostPos" is the initial position of the closing bracket ">":
      let leftmostPos = node.end - 1;
      // find the first non-whitespace character on the left:
      let idxOnTheLeft = left(context.str, leftmostPos) as number;
      if (
        context.str[idxOnTheLeft] === "/" ||
        context.str[idxOnTheLeft] === BACKSLASH
      ) {
        leftmostPos = idxOnTheLeft;
      }
      console.log(
        `056 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`leftmostPos`}\u001b[${39}m`} = ${JSON.stringify(
          leftmostPos,
          null,
          4
        )}`
      );

      // -----------------------------------------------------------------------------
      // depends, is format-prettier enabled or not

      if (
        ((Object.keys(context.processedRulesConfig).includes(
          "format-prettier"
        ) &&
          isAnEnabledValue(context.processedRulesConfig["format-prettier"]) &&
          node.void) ||
          // OR mode is set to "always":
          (mode === "always" &&
            // format-prettier is not enabled
            !(
              Object.keys(context.processedRulesConfig).includes(
                "format-prettier"
              ) &&
              isAnEnabledValue(context.processedRulesConfig["format-prettier"])
            ))) &&
        context.str[leftmostPos - 1] &&
        // it's not whitespace on the left
        (context.str[leftmostPos - 1].trim() ||
          // or it is, but it's not a single space
          context.str[leftmostPos - 1] !== " " ||
          // or it is a single space but to the left of it it's whitespace
          (context.str[leftmostPos - 2] &&
            !context.str[leftmostPos - 2].trim()))
      ) {
        console.log(`090 always mode - enforce spaces`);
        context.report({
          ruleId: "tag-space-before-closing-bracket",
          message: "Add a space.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [
              [
                (left(context.str, leftmostPos) as number) + 1,
                leftmostPos,
                " ",
              ],
            ],
          },
        });
      } else if (
        ((Object.keys(context.processedRulesConfig).includes(
          "format-prettier"
        ) &&
          isAnEnabledValue(context.processedRulesConfig["format-prettier"]) &&
          !node.void) ||
          // mode is "never"
          (mode !== "always" &&
            // and format-prettier is not enabled
            !(
              Object.keys(context.processedRulesConfig).includes(
                "format-prettier"
              ) &&
              isAnEnabledValue(context.processedRulesConfig["format-prettier"])
            ))) &&
        context.str[leftmostPos - 1] &&
        // there's whitespace to the left of slash/closing bracket
        !context.str[leftmostPos - 1].trim()
      ) {
        console.log(`125 never mode - ban spaces`);
        context.report({
          ruleId: "tag-space-before-closing-bracket",
          message: "Remove space.",
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [
              [(left(context.str, leftmostPos) as number) + 1, leftmostPos],
            ],
          },
        });
      }
    },
  };
}

export default tagSpaceBeforeClosingBracket;
