import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-shape
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateShape(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateShape() ███████████████████████████████████████`
      );

      console.log(
        `020 attributeValidateShape(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "shape") {
        // validate the parent
        if (!["area", "a"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-shape",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        const errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
          {
            permittedValues: ["default", "rect", "circle", "poly"],
            canBeCommaSeparated: false,
          }
        );

        console.log(
          `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`053 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-shape" });
        });
      }
    },
  };
}

export default attributeValidateShape;
