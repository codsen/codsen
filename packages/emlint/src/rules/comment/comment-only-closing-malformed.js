// rule: comment-only-closing-malformed
// -----------------------------------------------------------------------------

import validateCommentClosing from "../../util/validateCommentClosing";

function commentOnlyClosingMalformed(context, ...opts) {
  return {
    comment: function(node) {
      console.log(
        `███████████████████████████████████████ commentOnlyClosingMalformed() ███████████████████████████████████████`
      );
      console.log(
        `013 commentOnlyClosingMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 commentOnlyClosingMalformed(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.closing) {
        // run the tag's value past the validator function
        const errorArr = validateCommentClosing(node);
        console.log(
          `031 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`035 commentOnlyClosingMalformed(): RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "comment-only-closing-malformed"
            })
          );
        });
      }
    }
  };
}

export default commentOnlyClosingMalformed;
