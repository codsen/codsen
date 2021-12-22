import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-method
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateMethod(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateMethod() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateMethod(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "method") {
        // validate the parent
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-method",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        let errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
          {
            permittedValues: ["get", "post"],
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
          console.log(`050 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-method" });
        });
      }
    },
  };
}

export default attributeValidateMethod;
