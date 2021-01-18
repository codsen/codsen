import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-data
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateData(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateData() ███████████████████████████████████████`
      );

      console.log(
        `020 attributeValidateData(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "data") {
        // validate the parent
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-data",
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
            context.report({ ...errorObj, ruleId: "attribute-validate-data" });
          });
        }
      }
    },
  };
}

export default attributeValidateData;
