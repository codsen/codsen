// rule: attribute-validate-value
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";
import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateValue(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateValue() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
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
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if parent is OK
        else if (node.parent.tagName === "li") {
          // value is number
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units.",
            zeroOK: false,
            customPxMessage: `Sequence number should not be in pixels.`,
          }).forEach((errorObj) => {
            console.log(`050 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-value",
            });
          });
        } else {
          // all others - value is CDATA
          const { errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt
          );

          errorArr.forEach((errorObj) => {
            console.log(`064 RAISE ERROR`);
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
