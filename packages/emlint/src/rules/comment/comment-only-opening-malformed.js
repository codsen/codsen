// rule: comment-only-opening-malformed
// -----------------------------------------------------------------------------

import validateCommentOpening from "../../util/validateCommentOpening";

function commentOnlyOpeningMalformed(context, ...opts) {
  return {
    comment: function(node) {
      console.log(
        `███████████████████████████████████████ commentOnlyOpeningMalformed() ███████████████████████████████████████`
      );
      console.log(
        `013 commentOnlyOpeningMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 commentOnlyOpeningMalformed(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.closing) {
        // run the tag's value past the validator function
        const errorArr = validateCommentOpening(node.value, node.start, {
          commentType: "only"
        });
        console.log(
          `033 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`037 commentOnlyOpeningMalformed(): RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "comment-only-opening-malformed"
            })
          );
        });
      }
    }
  };
}

export default commentOnlyOpeningMalformed;
