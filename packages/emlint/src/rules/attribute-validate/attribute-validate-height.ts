import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-height
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateHeight(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateHeight() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateHeight(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
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
        DEV &&
          console.log(
            `056 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`060 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-height" });
        });
      }
    },
  };
}

export default attributeValidateHeight;
