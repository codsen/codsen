// rule: attribute-validate-height
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateHeight(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHeight() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateHeight(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "height") {
        // validate the parent
        if (
          !["iframe", "td", "th", "img", "object", "applet"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-height",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        const errorArr = validateDigitAndUnit(
          node.attribValueRaw,
          node.attribValueStartsAt,
          {
            badUnits: ["px"],
            theOnlyGoodUnits: ["%"],
            noUnitsIsFine: true,
            customGenericValueError: `Should be "pixels|%".`,
          }
        );
        console.log(
          `050 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`054 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-height" });
        });
      }
    },
  };
}

export default attributeValidateHeight;
