import { Linter, RuleObjType } from "../../linter";
import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-start
// -----------------------------------------------------------------------------

function attributeValidateStart(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
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

        let errorArr = validateDigitAndUnit(
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
        DEV &&
          console.log(
            `043 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`047 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-start" });
        });
      }
    },
  };
}

export default attributeValidateStart;
