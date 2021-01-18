import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-border
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateBorder(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateBorder() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateBorder(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "border") {
        // validate the parent
        if (!["table", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-border",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        const errorArr = validateDigitAndUnit(
          node.attribValueRaw,
          node.attribValueStartsAt as number,
          {
            type: "integer",
            negativeOK: false,
            theOnlyGoodUnits: [], // empty array means no units allowed
          }
        );
        console.log(
          `045 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`049 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-border" });
        });
      }
    },
  };
}

export default attributeValidateBorder;
