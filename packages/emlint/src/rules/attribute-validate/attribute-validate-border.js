// rule: attribute-validate-border
// -----------------------------------------------------------------------------

import { validateDigitOnly } from "../../util/util";

function attributeValidateBorder(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateBorder() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
      //   `015 attributeValidateBorder(): node = ${JSON.stringify(node, null, 4)}`
      // );

      const errorArr = validateDigitOnly(
        node.attribValue,
        node.attribValueStartAt,
        {
          type: "integer"
        }
      );
      console.log(
        `031 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
      );

      errorArr.forEach(errorObj => {
        console.log(`035 RAISE ERROR`);
        context.report(
          Object.assign({}, errorObj, {
            ruleId: "attribute-validate-border"
          })
        );
      });
    }
  };
}

export default attributeValidateBorder;
