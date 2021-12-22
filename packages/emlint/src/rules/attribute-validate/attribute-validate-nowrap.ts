import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";
import validateVoid from "../../util/validateVoid";

// rule: attribute-validate-nowrap
// -----------------------------------------------------------------------------

function attributeValidateNowrap(context: Linter, mode?: "xhtml"): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateNowrap() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${33}m${`mode`}\u001b[${39}m`} = ${JSON.stringify(
          mode,
          null,
          4
        )}`
      );
      console.log(
        `022 attributeValidateNowrap(): node = ${JSON.stringify(node, null, 4)}`
      );

      let errorArr: ErrorObj[] = [];

      if (node.attribName === "nowrap") {
        // validate the parent
        if (!["td", "th"].includes(node.parent.tagName)) {
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
            console.log(`047 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-nowrap",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateNowrap;
