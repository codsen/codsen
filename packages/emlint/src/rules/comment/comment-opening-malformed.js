// rule: comment-opening-malformed
// -----------------------------------------------------------------------------

import validateCommentOpening from "../../util/validateCommentOpening";
import findMalformed from "string-find-malformed";

function commentOpeningMalformed(context, ...opts) {
  return {
    text: node => {
      console.log(
        `███████████████████████████████████████ commentOpeningMalformed() TEXT ███████████████████████████████████████`
      );
      console.log(
        `014 commentOpeningMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );
      findMalformed(node, "<!--", errorObj => {
        console.log(
          `018 commentOpeningMalformed() / findAllInstancesOf(): RAISE ERROR`
        );
        context.report(
          Object.assign({}, errorObj, {
            message: "Malformed opening comment tag.",
            ruleId: "comment-opening-malformed",
            fix: {
              ranges: [[errorObj.idxFrom, errorObj.idxTo, "<!--"]]
            }
          })
        );
      });
    },
    comment: node => {
      console.log(
        `███████████████████████████████████████ commentOpeningMalformed() COMMENT ███████████████████████████████████████`
      );
      console.log(
        `036 commentOpeningMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `043 commentOpeningMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.closing) {
        // run the tag's value past the validator function
        const errorArr = validateCommentOpening(node);
        console.log(
          `050 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`054 commentOpeningMalformed(): RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "comment-opening-malformed"
            })
          );
        });
      }
    }
  };
}

export default commentOpeningMalformed;
