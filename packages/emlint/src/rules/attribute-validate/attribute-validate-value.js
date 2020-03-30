// rule: attribute-validate-value
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";
import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateValue(context, ...opts) {
  return {
    attribute: function (node) {
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
        } else {
          // if parent is OK
          if (node.parent.tagName === "li") {
            // value is number
            validateDigitAndUnit(node.attribValue, node.attribValueStartsAt, {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units.",
              zeroOK: false,
              customPxMessage: `Sequence number should not be in pixels.`,
            }).forEach((errorObj) => {
              console.log(`049 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-value",
                })
              );
            });
          } else {
            // all others - value is CDATA
            const { errorArr } = checkForWhitespace(
              node.attribValue,
              node.attribValueStartsAt
            );

            errorArr.forEach((errorObj) => {
              console.log(`064 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-value",
                })
              );
            });
          }
        }
      }
    },
  };
}

export default attributeValidateValue;
