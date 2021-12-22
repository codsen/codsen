import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-span
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateSpan(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateSpan() ███████████████████████████████████████`
      );

      if (node.attribName === "span") {
        // validate the parent
        if (!["col", "colgroup"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-span",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        let errorArr = validateDigitAndUnit(
          node.attribValueRaw,
          node.attribValueStartsAt as number,
          {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units.",
            zeroOK: false,
            customPxMessage: `Columns number is not in pixels.`,
          }
        );
        console.log(
          `039 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`043 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-span" });
        });
      }
    },
  };
}

export default attributeValidateSpan;
