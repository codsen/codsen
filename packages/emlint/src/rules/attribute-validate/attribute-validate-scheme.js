// rule: attribute-validate-scheme
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateScheme(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateScheme() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateScheme(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "scheme") {
        // validate the parent
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-scheme",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // only check for rogue whitespace - value can be any CDATA
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartsAt
        );
        console.log(
          `041 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`049 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-scheme",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateScheme;
