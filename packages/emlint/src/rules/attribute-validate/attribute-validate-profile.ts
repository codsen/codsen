import { Linter, RuleObjType } from "../../linter";
import validateUri from "../../util/validateUri";

// rule: attribute-validate-profile
// -----------------------------------------------------------------------------

function attributeValidateProfile(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateProfile() ███████████████████████████████████████`
      );

      console.log(
        `015 attributeValidateProfile(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "profile") {
        // validate the parent
        if (node.parent.tagName !== "head") {
          context.report({
            ruleId: "attribute-validate-profile",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // Call validation upon whole attribute's value. Validator includes
          // whitespace checks.
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt as number,
            multipleOK: true,
          }).forEach((errorObj) => {
            console.log(`039 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-profile",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateProfile;
