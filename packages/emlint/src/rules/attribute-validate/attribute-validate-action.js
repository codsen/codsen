// rule: attribute-validate-action
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateAction(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateAction() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateAction(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "action") {
        // validate the parent
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-action",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // Call validation upon whole attribute's value. Validator includes
          // whitespace checks.
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false,
          }).forEach((errorObj) => {
            console.log(`040 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-action",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateAction;
