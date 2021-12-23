import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-background
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateBackground(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateBackground() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateBackground(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "background") {
        // validate the parent
        if (!["body", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-background",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // Call validation upon the whole attribute's value. Validator includes
          // whitespace checks.
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt as number,
            multipleOK: false,
          }).forEach((errorObj) => {
            DEV && console.log(`045 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-background",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateBackground;
