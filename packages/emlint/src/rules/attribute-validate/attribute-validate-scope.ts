import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-scope
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateScope(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateScope() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateScope(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "scope") {
        // validate the parent
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-scope",
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
            permittedValues: ["row", "col", "rowgroup", "colgroup"],
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
          console.log(`049 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-scope" });
        });
      }
    },
  };
}

export default attributeValidateScope;
