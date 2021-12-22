import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";

// rule: attribute-validate-disabled
// -----------------------------------------------------------------------------

import validateVoid from "../../util/validateVoid";

function attributeValidateDisabled(
  context: Linter,
  mode?: "xhtml"
): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateDisabled() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${33}m${`mode`}\u001b[${39}m`} = ${JSON.stringify(
          mode,
          null,
          4
        )}`
      );
      console.log(
        `026 attributeValidateDisabled(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      let errorArr: ErrorObj[] = [];

      if (node.attribName === "disabled") {
        // validate the parent
        if (
          ![
            "button",
            "input",
            "optgroup",
            "option",
            "select",
            "textarea",
          ].includes(node.parent.tagName)
        ) {
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
            console.log(`064 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-disabled",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateDisabled;
