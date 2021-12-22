import { Linter, RuleObjType } from "../../linter";

// rule: comment-closing-malformed
// -----------------------------------------------------------------------------

import validateCommentClosing from "../../util/validateCommentClosing";

function commentClosingMalformed(context: Linter): RuleObjType {
  return {
    comment(node) {
      console.log(
        `███████████████████████████████████████ commentClosingMalformed() ███████████████████████████████████████`
      );
      console.log(
        `015 commentClosingMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.closing) {
        // run the tag's value past the validator function
        let errorArr = validateCommentClosing(node) || [];
        console.log(
          `022 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        // Out of all raised errors, only one can have "ranges.fix" -
        // all other fixes, if any present, will be removed.
        // This is to simplify the rule fix clashing.
        errorArr.forEach((errorObj) => {
          console.log(`029 commentClosingMalformed(): RAISE ERROR`);
          context.report({
            ...errorObj,
            keepSeparateWhenFixing: true,
            ruleId: "comment-closing-malformed",
          });
        });
      }
    },
  };
}

export default commentClosingMalformed;
