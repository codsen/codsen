import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";

// rule: attribute-validate-checked
// -----------------------------------------------------------------------------

import validateVoid from "../../util/validateVoid";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateChecked(
  context: Linter,
  mode?: "xhtml"
): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateChecked() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `${`\u001b[${33}m${`mode`}\u001b[${39}m`} = ${JSON.stringify(
            mode,
            null,
            4
          )}`
        );
      DEV &&
        console.log(
          `032 attributeValidateChecked(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      let errorArr: ErrorObj[] = [];

      if (node.attribName === "checked") {
        // validate the parent
        if (node.parent.tagName !== "input") {
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
            enforceSiblingAttributes: {
              type: ["checkbox", "radio"],
            },
          });
        }

        // finally, report gathered errors:
        if (errorArr.length) {
          errorArr.forEach((errorObj) => {
            DEV && console.log(`063 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-checked",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateChecked;
