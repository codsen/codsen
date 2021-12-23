import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-maxlength
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateMaxlength(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateMaxlength() ███████████████████████████████████████`
        );

      // DEV && console.log(
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

        let errorArr = validateDigitAndUnit(
          node.attribValueRaw,
          node.attribValueStartsAt as number,
          {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units.",
          }
        );
        DEV &&
          console.log(
            `046 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`050 RAISE ERROR`);
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
