// rule: attribute-validate-colspan
// -----------------------------------------------------------------------------

import { validateDigitOnly } from "../../util/util";

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

        const errorArr = validateDigitOnly(
          node.attribValue,
          node.attribValueStartAt,
          {
            type: "integer",
            negativeOK: false
          }
        );
        console.log(
          `044 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`048 RAISE ERROR`);
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
