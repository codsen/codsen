// rule: attribute-validate-span
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateSpan(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateSpan() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );

      if (node.attribName === "span") {
        // validate the parent
        if (!["col", "colgroup"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-span",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartsAt,
          {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units.",
            zeroOK: false,
            customPxMessage: `Columns number is not in pixels.`
          }
        );
        console.log(
          `044 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`048 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-span"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateSpan;
