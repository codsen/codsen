import { left } from "string-left-right";

import { Linter, RuleObjType } from "../../linter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

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
      DEV &&
        console.log(
          `███████████████████████████████████████ tagVoidSlash() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `028 tagVoidSlash(): ${`\u001b[${35}m${`mode`}\u001b[${39}m`} = "${mode}"`
        );
      DEV &&
        console.log(
          `032 tagVoidSlash(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      // PROCESSING:
      let closingBracketPos = node.end - 1;
      let slashPos: number = left(context.str, closingBracketPos) as number;
      let leftOfSlashPos = left(context.str, slashPos) || 0;

      if (mode === "never" && node.void && context.str[slashPos] === "/") {
        // if slashes are forbidden on void tags, delete the slash and all
        // the whitespace in front, because there's never a space before
        // non-void tag's closing bracket without a slash, for example, "<span >"
        DEV && console.log(`048 tagVoidSlash(): remove the slash`);
        context.report({
          ruleId: "tag-void-slash",
          message: "Remove the slash.",
          idxFrom: node.start,
          idxTo: node.end,
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
        DEV && console.log(`076 tagVoidSlash()`);
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
          DEV && console.log(`087 tagVoidSlash()`);
          // space is needed
          // check, maybe space is there
          if (context.str[slashPos + 1] === " ") {
            // but space exists already
            DEV && console.log(`092 tagVoidSlash(): add slash only`);
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: node.start,
              idxTo: node.end,
              // overwrite the closing bracket too because it will solve the
              // problem when trying to sort the fixes when attributes inside
              // operate on nearby index positions - otherwise clashes can
              // happen, for example,
              //
              // <img alt=">
              //
              // with 2 rules: attribute-malformed, tag-void-slash
              fix: { ranges: [[slashPos + 2, closingBracketPos + 1, "/>"]] },
            });
          } else {
            // space is missing so add one
            DEV && console.log(`110 tagVoidSlash(): add space and slash`);
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: node.start,
              idxTo: node.end,
              fix: { ranges: [[slashPos + 1, closingBracketPos + 1, " />"]] },
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
          DEV && console.log(`134 tagVoidSlash(): add slash only`);
          context.report({
            ruleId: "tag-void-slash",
            message: "Missing slash.",
            idxFrom: node.start,
            idxTo: node.end,
            fix: { ranges: [[closingBracketPos, closingBracketPos + 1, "/>"]] },
          });
        }
      }
    },
  };
}

export default tagVoidSlash;
