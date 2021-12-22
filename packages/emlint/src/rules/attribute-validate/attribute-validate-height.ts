import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-height
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateHeight(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHeight() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateHeight(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "height") {
        // validate the parent
        if (
          !["iframe", "td", "th", "img", "object", "applet"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-height",
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
            badUnits: ["px"],
            theOnlyGoodUnits: ["%"],
            noUnitsIsFine: true,
            customGenericValueError: `Should be "pixels|%".`,
          }
        );
        console.log(
          `046 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`050 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-height" });
        });
      }
    },
  };
}

export default attributeValidateHeight;
