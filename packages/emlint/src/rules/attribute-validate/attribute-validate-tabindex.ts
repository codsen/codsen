import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-tabindex
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateTabindex(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateTabindex() ███████████████████████████████████████`
        );

      if (node.attribName === "tabindex") {
        // validate the parent
        if (
          ![
            "a",
            "area",
            "button",
            "input",
            "object",
            "select",
            "textarea",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-tabindex",
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
            zeroOK: true,
            customPxMessage: `Tabbing order number should not be in pixels.`,
            maxValue: 32767,
          }
        );
        DEV &&
          console.log(
            `055 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`059 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-tabindex",
          });
        });
      }
    },
  };
}

export default attributeValidateTabindex;
