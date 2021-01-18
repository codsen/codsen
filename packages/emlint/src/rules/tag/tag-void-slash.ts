import { Linter, RuleObjType } from "../../linter";
import { left } from "string-left-right";

// rule: tag-void-slash
// -----------------------------------------------------------------------------

// it controls, should we or should we not put the slashes on void tags,
// such as img. Is it <img...> or is it <img.../>?

const BACKSLASH = "\u005C";

function tagVoidSlash(
  context: Linter,
  mode: "always" | "never" = "always"
): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagVoidSlash() ███████████████████████████████████████`
      );
      console.log(
        `022 tagVoidSlash(): ${`\u001b[${35}m${`mode`}\u001b[${39}m`} = "${mode}"`
      );

      // PROCESSING:
      const closingBracketPos = node.end - 1;
      const slashPos: number = left(context.str, closingBracketPos) as number;
      const leftOfSlashPos = left(context.str, slashPos) || 0;

      if (mode === "never" && node.void && context.str[slashPos] === "/") {
        // if slashes are forbidden on void tags, delete the slash and all
        // the whitespace in front, because there's never a space before
        // non-void tag's closing bracket without a slash, for example, "<span >"
        console.log(`037 whitespace present in front of closing slash!`);
        context.report({
          ruleId: "tag-void-slash",
          message: "Remove the slash.",
          idxFrom: leftOfSlashPos + 1,
          idxTo: closingBracketPos,
          fix: { ranges: [[leftOfSlashPos + 1, closingBracketPos]] },
        });
      } else if (
        mode === "always" &&
        node.void &&
        context.str[slashPos] !== "/" &&
        // don't trigger if backslash rules are on:
        (!context.processedRulesConfig["tag-closing-backslash"] ||
          !(
            context.str[slashPos] === BACKSLASH &&
            ((Number.isInteger(
              context.processedRulesConfig["tag-closing-backslash"]
            ) &&
              context.processedRulesConfig["tag-closing-backslash"] > 0) ||
              (Array.isArray(
                context.processedRulesConfig["tag-closing-backslash"]
              ) &&
                context.processedRulesConfig["tag-closing-backslash"][0] > 0 &&
                context.processedRulesConfig["tag-closing-backslash"][1] ===
                  "always"))
          ))
      ) {
        console.log(`065`);
        // if slashes are requested on void tags, situation is more complex,
        // because we need to take into the account the rule
        // "tag-space-before-closing-slash"
        if (
          Array.isArray(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
          context.processedRulesConfig["tag-space-before-closing-slash"][1] ===
            "always"
        ) {
          console.log(`076`);
          // space is needed
          // check, maybe space is there
          if (context.str[slashPos + 1] === " ") {
            // but space exists already
            console.log(`081 add slash only`);
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: slashPos + 2,
              idxTo: closingBracketPos,
              fix: { ranges: [[slashPos + 2, closingBracketPos, "/"]] },
            });
          } else {
            // space is missing so add one
            console.log(`091 add space and slash`);
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: slashPos + 1,
              idxTo: closingBracketPos,
              fix: { ranges: [[slashPos + 1, closingBracketPos, " /"]] },
            });
          }
        } else if (
          context.processedRulesConfig["tag-space-before-closing-slash"] ===
            undefined ||
          (Array.isArray(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
            context.processedRulesConfig[
              "tag-space-before-closing-slash"
            ][1] === "never") ||
          (Number.isInteger(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
            context.processedRulesConfig["tag-space-before-closing-slash"] > 0)
        ) {
          // no space needed
          console.log(`115 add slash only`);
          context.report({
            ruleId: "tag-void-slash",
            message: "Missing slash.",
            idxFrom: slashPos + 1,
            idxTo: closingBracketPos,
            fix: { ranges: [[slashPos + 1, closingBracketPos, "/"]] },
          });
        }
      }
    },
  };
}

export default tagVoidSlash;
