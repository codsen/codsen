// rule: attribute-validate-height
// -----------------------------------------------------------------------------

import { validateDigitAndUnit } from "../../util/util";

function attributeValidateHeight(context, ...opts) {
  return {
    attribute: function(node) {
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
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            badUnits: ["px"],
            theOnlyGoodUnits: ["%"],
            noUnitsIsFine: true,
            customGenericValueError: `Should be "pixels|%".`
          }
        );
        console.log(
          `050 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`054 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-height"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateHeight;
