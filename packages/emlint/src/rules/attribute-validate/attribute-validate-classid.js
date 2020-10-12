// rule: attribute-validate-classid
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateClassid(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateClassid() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateClassid(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "classid") {
        // validate the parent
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-classid",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
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
              ruleId: "attribute-validate-classid",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateClassid;
