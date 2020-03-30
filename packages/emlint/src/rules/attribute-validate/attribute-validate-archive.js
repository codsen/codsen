// rule: attribute-validate-archive
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateArchive(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateArchive() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateArchive(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "archive") {
        // validate the parent
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-archive",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // it depends, which tag is this attribute on...
          if (node.parent.tagName === "applet") {
            // comma-separated list of archive URIs
            // Call validation upon the whole attribute's value. Validator includes
            // whitespace checks.
            validateUri(node.attribValue, {
              offset: node.attribValueStartsAt,
              separator: "comma",
              multipleOK: true,
            }).forEach((errorObj) => {
              console.log(`048 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-archive",
                })
              );
            });
          } else if (node.parent.tagName === "object") {
            // space-separated list of URIs
            // Call validation upon the whole attribute's value. Validator includes
            // whitespace checks.
            validateUri(node.attribValue, {
              offset: node.attribValueStartsAt,
              separator: "space", // or "comma"
              multipleOK: true,
            }).forEach((errorObj) => {
              console.log(`064 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-archive",
                })
              );
            });
          }
        }
      }
    },
  };
}

export default attributeValidateArchive;
