import { Linter, RuleObjType } from "../../linter";
import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// rule: attribute-validate-start
// -----------------------------------------------------------------------------

function attributeValidateStart(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateStart() ███████████████████████████████████████`
      );

      if (node.attribName === "start") {
        // validate the parent
        if (node.parent.tagName !== "ol") {
          context.report({
            ruleId: "attribute-validate-start",
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
            zeroOK: false,
            customPxMessage: `Starting sequence number is not in pixels.`,
          }
        );
        console.log(
          `038 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`042 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-start" });
        });
      }
    },
  };
}

export default attributeValidateStart;
