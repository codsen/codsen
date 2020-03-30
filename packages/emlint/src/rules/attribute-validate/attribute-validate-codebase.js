// rule: attribute-validate-codebase
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateCodebase(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCodebase() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateCodebase(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "codebase") {
        // validate the parent
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-codebase",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          validateUri(node.attribValue, {
            offset: node.attribValueStartsAt,
            multipleOK: false,
          }).forEach((errorObj) => {
            console.log(`042 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-codebase",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateCodebase;
