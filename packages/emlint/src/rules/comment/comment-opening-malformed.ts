import { findMalformed } from "string-find-malformed";

import { Linter, RuleObjType } from "../../linter";

// rule: comment-opening-malformed
// -----------------------------------------------------------------------------

import validateCommentOpening from "../../util/validateCommentOpening";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function commentOpeningMalformed(context: Linter): RuleObjType {
  return {
    text: (node) => {
      DEV &&
        console.log(
          `███████████████████████████████████████ commentOpeningMalformed() TEXT ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `022 commentOpeningMalformed(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );
      findMalformed(
        node.value,
        "<!--",
        (errorObj) => {
          DEV &&
            console.log(
              `034 commentOpeningMalformed() / findAllInstancesOf(): RAISE ERROR`
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
      DEV &&
        console.log(
          `███████████████████████████████████████ commentOpeningMalformed() COMMENT ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `057 commentOpeningMalformed(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (!node.closing) {
        // run the tag's value past the validator function
        let errorArr = validateCommentOpening(node) || [];
        DEV &&
          console.log(
            `069 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`073 commentOpeningMalformed(): RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "comment-opening-malformed" });
        });
      }
    },
  };
}

export default commentOpeningMalformed;
