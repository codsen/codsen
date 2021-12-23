import { Linter, RuleObjType } from "../../linter";

// rule: comment-closing-malformed
// -----------------------------------------------------------------------------

import validateCommentClosing from "../../util/validateCommentClosing";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function commentClosingMalformed(context: Linter): RuleObjType {
  return {
    comment(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ commentClosingMalformed() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `020 commentClosingMalformed(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.closing) {
        // run the tag's value past the validator function
        let errorArr = validateCommentClosing(node) || [];
        DEV &&
          console.log(
            `032 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

        // Out of all raised errors, only one can have "ranges.fix" -
        // all other fixes, if any present, will be removed.
        // This is to simplify the rule fix clashing.
        errorArr.forEach((errorObj) => {
          DEV && console.log(`039 commentClosingMalformed(): RAISE ERROR`);
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
