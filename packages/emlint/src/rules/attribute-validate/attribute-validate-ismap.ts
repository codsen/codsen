import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";

// rule: attribute-validate-ismap
// -----------------------------------------------------------------------------

import validateVoid from "../../util/validateVoid";

function attributeValidateIsmap(context: Linter, mode?: "xhtml"): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateIsmap() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${33}m${`mode`}\u001b[${39}m`} = ${JSON.stringify(
          mode,
          null,
          4
        )}`
      );
      console.log(
        `023 attributeValidateIsmap(): node = ${JSON.stringify(node, null, 4)}`
      );

      const errorArr: ErrorObj[] = [];

      if (node.attribName === "ismap") {
        // validate the parent
        if (!["img", "input"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // validate the value (or absence thereof)
          validateVoid(node, context, errorArr, {
            xhtml: !!mode,
            enforceSiblingAttributes: null,
          });
        }

        // finally, report gathered errors:
        if (errorArr.length) {
          errorArr.forEach((errorObj) => {
            console.log(`048 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-ismap",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateIsmap;
