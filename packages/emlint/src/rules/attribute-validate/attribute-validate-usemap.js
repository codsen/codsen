// rule: attribute-validate-usemap
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateUsemap(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateUsemap() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateUsemap(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "usemap") {
        // validate the parent
        if (!["img", "input", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-usemap",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt,
            multipleOK: false,
          }).forEach((errorObj) => {
            console.log(`038 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-usemap",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateUsemap;
