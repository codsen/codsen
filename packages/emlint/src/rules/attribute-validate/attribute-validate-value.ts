import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-value
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";
import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateValue(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateValue() ███████████████████████████████████████`
        );

      // DEV && console.log(
      //   `015 attributeValidateValue(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "value") {
        // validate the parent
        if (
          !["input", "option", "param", "button", "li"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-value",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if parent is OK
        else if (node.parent.tagName === "li") {
          // value is number
          validateDigitAndUnit(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units.",
              zeroOK: false,
              customPxMessage: `Sequence number should not be in pixels.`,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`054 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-value",
            });
          });
        } else {
          // all others - value is CDATA
          let { errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );

          errorArr.forEach((errorObj) => {
            DEV && console.log(`068 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-value",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateValue;
