import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-marginheight
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateMarginheight(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateMarginheight() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateMarginheight(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "marginheight") {
        // validate the parent
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginheight",
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
        console.log(
          `040 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`044 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-marginheight",
          });
        });
      }
    },
  };
}

export default attributeValidateMarginheight;
