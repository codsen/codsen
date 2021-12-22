import { findMalformed } from "string-find-malformed";

import { Linter, RuleObjType } from "../../linter";

// rule: comment-opening-malformed
// -----------------------------------------------------------------------------

import validateCommentOpening from "../../util/validateCommentOpening";

function commentOpeningMalformed(context: Linter): RuleObjType {
  return {
    text: (node) => {
      console.log(
        `███████████████████████████████████████ commentOpeningMalformed() TEXT ███████████████████████████████████████`
      );
      console.log(
        `017 commentOpeningMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );
      findMalformed(
        node.value,
        "<!--",
        (errorObj) => {
          console.log(
            `024 commentOpeningMalformed() / findAllInstancesOf(): RAISE ERROR`
          );
          context.report({
            ...errorObj,
            message: "Malformed opening comment tag.",
            ruleId: "comment-opening-malformed",
            fix: {
              ranges: [[errorObj.idxFrom, errorObj.idxTo, "<!--"]],
            },
          });
        },
        {
          stringOffset: node.start,
        }
      );
    },
    comment: (node) => {
      console.log(
        `███████████████████████████████████████ commentOpeningMalformed() COMMENT ███████████████████████████████████████`
      );
      console.log(
        `045 commentOpeningMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (!node.closing) {
        // run the tag's value past the validator function
        let errorArr = validateCommentOpening(node) || [];
        console.log(
          `052 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`056 commentOpeningMalformed(): RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "comment-opening-malformed" });
        });
      }
    },
  };
}

export default commentOpeningMalformed;
