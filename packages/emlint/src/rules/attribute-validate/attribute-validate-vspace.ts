import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-vspace
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateVspace(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateVspace() ███████████████████████████████████████`
      );

      // console.log(
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
        console.log(
          `040 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`044 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-vspace" });
        });
      }
    },
  };
}

export default attributeValidateVspace;
