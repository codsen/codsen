import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";

// rule: attribute-validate-ismap
// -----------------------------------------------------------------------------

import validateVoid from "../../util/validateVoid";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateIsmap(context: Linter, mode?: "xhtml"): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateIsmap() ███████████████████████████████████████`
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
          `029 attributeValidateIsmap(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      let errorArr: ErrorObj[] = [];

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
            DEV && console.log(`058 RAISE ERROR`);
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
