import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-src
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateSrc(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateSrc() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateSrc(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "src") {
        // validate the parent
        if (
          !["script", "input", "frame", "iframe", "img"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-src",
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
            console.log(`038 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-src" });
          });
        }
      }
    },
  };
}

export default attributeValidateSrc;
