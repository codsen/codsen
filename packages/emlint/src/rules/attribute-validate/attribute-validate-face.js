// rule: attribute-validate-face
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateFace(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateFace() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateFace(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "face") {
        // validate the parent
        if (node.parent.tagName !== "font") {
          context.report({
            ruleId: "attribute-validate-face",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // only validate the whitespace
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartsAt
        );
        console.log(
          `041 ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
            charStart,
            null,
            4
          )}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
            charEnd,
            null,
            4
          )}`
        );
        console.log(
          `052 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`060 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-face",
            })
          );
        });
      }
    },
  };
}

// TODO - add more checks from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta

export default attributeValidateFace;
