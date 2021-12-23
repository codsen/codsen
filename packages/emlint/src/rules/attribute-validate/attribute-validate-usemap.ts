import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-usemap
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateUsemap(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateUsemap() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateUsemap(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "usemap") {
        // validate the parent
        if (!["img", "input", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-usemap",
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
            DEV && console.log(`043 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-usemap",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateUsemap;
