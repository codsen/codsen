// rule: attribute-validate-width
// -----------------------------------------------------------------------------

import { validateDigitAndUnit } from "../../util/util";

function attributeValidateWidth(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateWidth() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
      //   `015 attributeValidateWidth(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "width") {
        // validate the parent
        if (
          ![
            "hr",
            "iframe",
            "img",
            "object",
            "table",
            "td",
            "th",
            "applet",
            "col",
            "colgroup",
            "pre"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-width",
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
            noUnitsIsFine: true
          }
        );
        console.log(
          `058 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`062 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-width"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateWidth;
