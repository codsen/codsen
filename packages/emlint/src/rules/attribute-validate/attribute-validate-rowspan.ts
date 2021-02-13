import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-rowspan
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateRowspan(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateRowspan() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateRowspan(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "rowspan") {
        // validate the parent
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rowspan",
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
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units.",
          }
        );
        console.log(
          `041 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`045 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-rowspan" });
        });
      }
    },
  };
}

export default attributeValidateRowspan;
