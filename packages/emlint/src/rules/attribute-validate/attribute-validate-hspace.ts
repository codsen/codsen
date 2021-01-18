import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-hspace
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateHspace(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHspace() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateHspace(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "hspace") {
        // validate the parent
        if (!["applet", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-hspace",
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
            theOnlyGoodUnits: [], // all units are bad, value is in px which is omitted
            noUnitsIsFine: true,
          }
        );
        console.log(
          `044 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`048 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-hspace" });
        });
      }
    },
  };
}

export default attributeValidateHspace;
