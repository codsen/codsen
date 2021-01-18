import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";

// rule: attribute-validate-selected
// -----------------------------------------------------------------------------

import validateVoid from "../../util/validateVoid";

function attributeValidateSelected(
  context: Linter,
  mode?: "xhtml"
): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateSelected() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${33}m${`mode`}\u001b[${39}m`} = ${JSON.stringify(
          mode,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateSelected(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      const errorArr: ErrorObj[] = [];

      if (node.attribName === "selected") {
        // validate the parent
        if (node.parent.tagName !== "option") {
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
            console.log(`063 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-selected",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateSelected;
