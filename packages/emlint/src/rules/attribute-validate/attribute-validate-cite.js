// rule: attribute-validate-cite
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateCite(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCite() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateCite(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "cite") {
        // validate the parent
        if (!["blockquote", "q", "del", "ins"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-cite",
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
            console.log(`040 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-cite",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateCite;
