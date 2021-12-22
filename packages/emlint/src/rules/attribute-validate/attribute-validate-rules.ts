import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-rules
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateRules(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateRules() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateRules(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "rules") {
        // validate the parent
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-rules",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // https://www.w3.org/TR/html4/struct/tables.html#adef-frame
        let errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
          {
            permittedValues: ["none", "groups", "rows", "cols", "all"],
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
          context.report({ ...errorObj, ruleId: "attribute-validate-rules" });
        });
      }
    },
  };
}

export default attributeValidateRules;
