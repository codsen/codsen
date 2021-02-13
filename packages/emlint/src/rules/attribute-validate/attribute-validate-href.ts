import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-href
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateHref(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHref() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateHref(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "href") {
        // validate the parent
        if (!["a", "area", "link", "base"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-href",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt as number,
            multipleOK: false,
          }).forEach((errorObj) => {
            console.log(`034 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-href" });
          });
        }
      }
    },
  };
}

export default attributeValidateHref;
