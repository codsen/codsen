// rule: comment-opening-malformed
// -----------------------------------------------------------------------------

import validateCommentOpening from "../../util/validateCommentOpening";

function commentOpeningMalformed(context, ...opts) {
  return {
    comment: function(node) {
      console.log(
        `███████████████████████████████████████ commentOpeningMalformed() ███████████████████████████████████████`
      );
      console.log(
        `013 commentOpeningMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 commentOpeningMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.closing) {
        // run the tag's value past the validator function
        const errorArr = validateCommentOpening(node);
        console.log(
          `027 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`031 commentOpeningMalformed(): RAISE ERROR`);
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
