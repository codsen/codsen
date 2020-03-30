// rule: attribute-validate-href
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateHref(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHref() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateHref(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "href") {
        // validate the parent
        if (!["a", "area", "link", "base"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-href",
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
            console.log(`038 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-href",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateHref;
