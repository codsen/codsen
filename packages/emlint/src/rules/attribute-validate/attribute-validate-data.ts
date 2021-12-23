import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-data
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateData(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateData() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateData(): node = ${JSON.stringify(node, null, 4)}`
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
            DEV && console.log(`039 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-data" });
          });
        }
      }
    },
  };
}

export default attributeValidateData;
