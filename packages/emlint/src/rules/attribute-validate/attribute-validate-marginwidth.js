// rule: attribute-validate-marginwidth
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateMarginwidth(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateMarginwidth() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
      //   `015 attributeValidateMarginwidth(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "marginwidth") {
        // validate the parent
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginwidth",
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
            theOnlyGoodUnits: [], // all units are bad, value is in px which is omitted
            noUnitsIsFine: true
          }
        );
        console.log(
          `044 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`048 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-marginwidth"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateMarginwidth;
