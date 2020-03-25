// rule: tag-void-slash
// -----------------------------------------------------------------------------

// it controls, should we or should we not put the slashes on void tags,
// such as img. Is it <img...> or is it <img.../>?

import { left } from "string-left-right";
const BACKSLASH = "\u005C";

function tagVoidSlash(context, ...opts) {
  return {
    tag: function (node) {
      console.log(
        `███████████████████████████████████████ tagVoidSlash() ███████████████████████████████████████`
      );
      // settle the mode, is it "always" or a default, "never"
      let mode = "always";
      // opts array comes already sliced, without 1st element, so opts value
      // is 0th (and onwards if more)
      if (Array.isArray(opts) && ["always", "never"].includes(opts[0])) {
        mode = opts[0];
      }
      console.log(
        `024 tagVoidSlash(): ${`\u001b[${35}m${`calculated mode`}\u001b[${39}m`} = "${mode}"`
      );

      // PROCESSING:
      const closingBracketPos = node.end - 1;
      const slashPos = left(context.str, closingBracketPos);
      const leftOfSlashPos = left(context.str, slashPos);

      if (mode === "never" && node.void && context.str[slashPos] === "/") {
        // if slashes are forbidden on void tags, delete the slash and all
        // the whitespace in front, because there's never a space before
        // non-void tag's closing bracket without a slash, for example, "<span >"
        console.log(`036 whitespace present in front of closing slash!`);
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
        console.log(`064`);
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
          console.log(`075`);
          // space is needed
          // check, maybe space is there
          if (context.str[slashPos + 1] === " ") {
            // but space exists already
            console.log(`080 add slash only`);
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: slashPos + 2,
              idxTo: closingBracketPos,
              fix: { ranges: [[slashPos + 2, closingBracketPos, "/"]] },
            });
          } else {
            // space is missing so add one
            console.log(`090 add space and slash`);
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
          console.log(`114 add slash only`);
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
