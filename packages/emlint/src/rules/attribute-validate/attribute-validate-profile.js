// rule: attribute-validate-profile
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateProfile(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateProfile() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateProfile(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "profile") {
        // validate the parent
        if (node.parent.tagName !== "head") {
          context.report({
            ruleId: "attribute-validate-profile",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null,
          });
        } else {
          // Call validation upon whole attribute's value. Validator includes
          // whitespace checks.
          validateUri(node.attribValue, {
            offset: node.attribValueStartsAt,
            multipleOK: true,
          }).forEach((errorObj) => {
            console.log(`044 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-profile",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateProfile;
