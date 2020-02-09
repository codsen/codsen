// rule: attribute-validate-colspan
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateColspan(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateColspan() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
      //   `015 attributeValidateColspan(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "colspan") {
        // validate the parent
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-colspan",
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
            customGenericValueError: "Should be integer, no units."
          }
        );
        console.log(
          `045 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`049 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-colspan"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateColspan;
