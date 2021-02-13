import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-valuetype
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateValuetype(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateValuetype() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateValuetype(): node = ${JSON.stringify(
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
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              permittedValues: ["data", "ref", "object"],
              canBeCommaSeparated: false,
            }
          ).forEach((errorObj) => {
            console.log(`042 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-valuetype",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateValuetype;
