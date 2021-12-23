import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-codebase
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateCodebase(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateCodebase() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateCodebase(): node = ${JSON.stringify(
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
            DEV && console.log(`043 RAISE ERROR`);
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
