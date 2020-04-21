// rule: attribute-validate-background
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateBackground(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateBackground() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateBackground(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "background") {
        // validate the parent
        if (!["body", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-background",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // Call validation upon the whole attribute's value. Validator includes
          // whitespace checks.
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false,
          }).forEach((errorObj) => {
            console.log(`044 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-background",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateBackground;
