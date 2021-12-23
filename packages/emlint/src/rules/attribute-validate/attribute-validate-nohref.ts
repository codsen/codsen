import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";
import validateVoid from "../../util/validateVoid";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-nohref
// -----------------------------------------------------------------------------

function attributeValidateNohref(context: Linter, mode?: "xhtml"): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateNohref() ███████████████████████████████████████`
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
          `028 attributeValidateNohref(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      let errorArr: ErrorObj[] = [];

      if (node.attribName === "nohref") {
        // validate the parent
        if (node.parent.tagName !== "area") {
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
            DEV && console.log(`057 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-nohref",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateNohref;
