// rule: comment-closing-malformed
// -----------------------------------------------------------------------------

import validateCommentClosing from "../../util/validateCommentClosing";

function commentClosingMalformed(context, ...opts) {
  return {
    comment: function (node) {
      console.log(
        `███████████████████████████████████████ commentClosingMalformed() ███████████████████████████████████████`
      );
      console.log(
        `013 commentClosingMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 commentClosingMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.closing) {
        // run the tag's value past the validator function
        const errorArr = validateCommentClosing(node) || [];
        console.log(
          `027 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        // Out of all raised errors, only one can have "ranges.fix" -
        // all other fixes, if any present, will be removed.
        // This is to simplify the rule fix clashing.
        errorArr.forEach((errorObj) => {
          console.log(`034 commentClosingMalformed(): RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              keepSeparateWhenFixing: true,
              ruleId: "comment-closing-malformed",
            })
          );
        });
      }
    },
  };
}

export default commentClosingMalformed;
