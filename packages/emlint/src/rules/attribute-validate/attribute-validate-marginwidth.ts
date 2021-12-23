import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-marginwidth
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateMarginwidth(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateMarginwidth() ███████████████████████████████████████`
        );

      // DEV && console.log(
      //   `015 attributeValidateMarginwidth(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "marginwidth") {
        // validate the parent
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginwidth",
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
            theOnlyGoodUnits: [], // all units are bad, value is in px which is omitted
            noUnitsIsFine: true,
          }
        );
        DEV &&
          console.log(
            `045 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`049 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-marginwidth",
          });
        });
      }
    },
  };
}

export default attributeValidateMarginwidth;
