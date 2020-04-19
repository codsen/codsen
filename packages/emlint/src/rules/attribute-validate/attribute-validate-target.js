// rule: attribute-validate-target
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateTarget(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateTarget() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateTarget(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "target") {
        // validate the parent
        if (
          !["a", "area", "base", "form", "link"].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-target",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // only check for rogue whitespace because value can be any CDATA
        const { errorArr } = checkForWhitespace(
          node.attribValueRaw,
          node.attribValueStartsAt
        );
        console.log(
          `043 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`051 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-target",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateTarget;
