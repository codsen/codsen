// rule: attribute-validate-valuetype
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateValuetype(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateValuetype() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateValuetype(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "valuetype") {
        // validate the parent
        if (node.parent.tagName !== "param") {
          context.report({
            ruleId: "attribute-validate-valuetype",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null,
          });
        } else {
          validateString(
            node.attribValue, // value
            node.attribValueStartsAt, // offset
            {
              permittedValues: ["data", "ref", "object"],
              canBeCommaSeparated: false,
            }
          ).forEach((errorObj) => {
            console.log(`046 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-valuetype",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateValuetype;
