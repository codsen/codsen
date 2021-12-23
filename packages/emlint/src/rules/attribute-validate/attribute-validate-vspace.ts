import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-vspace
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateVspace(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateVspace() ███████████████████████████████████████`
        );

      // DEV && console.log(
      //   `015 attributeValidateVspace(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "vspace") {
        // validate the parent
        if (!["applet", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-vspace",
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
          context.report({ ...errorObj, ruleId: "attribute-validate-vspace" });
        });
      }
    },
  };
}

export default attributeValidateVspace;
