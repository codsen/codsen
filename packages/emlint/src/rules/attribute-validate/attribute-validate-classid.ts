import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-classid
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateClassid(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateClassid() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateClassid(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "classid") {
        // validate the parent
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-classid",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // Call validation upon the whole attribute's value. Validator includes
          // whitespace checks.
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt as number,
            multipleOK: false,
          }).forEach((errorObj) => {
            console.log(`040 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-classid",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateClassid;
