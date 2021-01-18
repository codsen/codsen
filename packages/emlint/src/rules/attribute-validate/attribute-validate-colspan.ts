import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-colspan
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateColspan(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateColspan() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateColspan(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "colspan") {
        // validate the parent
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-colspan",
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
          `045 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`049 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-colspan" });
        });
      }
    },
  };
}

export default attributeValidateColspan;
