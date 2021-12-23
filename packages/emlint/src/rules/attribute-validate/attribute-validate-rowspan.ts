import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-rowspan
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateRowspan(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateRowspan() ███████████████████████████████████████`
        );

      // DEV && console.log(
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
          context.report({ ...errorObj, ruleId: "attribute-validate-rowspan" });
        });
      }
    },
  };
}

export default attributeValidateRowspan;
