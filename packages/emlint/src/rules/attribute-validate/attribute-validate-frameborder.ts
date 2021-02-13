import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-frameborder
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateFrameborder(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateFrameborder() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateFrameborder(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "frameborder") {
        // validate the parent
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-frameborder",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // https://www.w3.org/TR/html4/present/frames.html#adef-frameborder
        const errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
          {
            permittedValues: ["0", "1"],
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
          console.log(`054 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-frameborder",
          });
        });
      }
    },
  };
}

export default attributeValidateFrameborder;
