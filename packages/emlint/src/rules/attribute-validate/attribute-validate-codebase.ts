import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-codebase
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateCodebase(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCodebase() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateCodebase(): node = ${JSON.stringify(
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
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt as number,
            multipleOK: false,
          }).forEach((errorObj) => {
            console.log(`038 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-codebase",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateCodebase;
