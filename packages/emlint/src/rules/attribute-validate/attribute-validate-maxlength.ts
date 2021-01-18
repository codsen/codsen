import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-maxlength
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateMaxlength(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateMaxlength() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateMaxlength(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "maxlength") {
        // validate the parent
        if (node.parent.tagName !== "input") {
          context.report({
            ruleId: "attribute-validate-maxlength",
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
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-maxlength",
          });
        });
      }
    },
  };
}

export default attributeValidateMaxlength;
