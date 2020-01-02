// rule: attribute-validate-frameborder
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateFrameborder(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateFrameborder() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateFrameborder(): node = ${JSON.stringify(
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
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // https://www.w3.org/TR/html4/present/frames.html#adef-frameborder
        const errorArr = validateString(
          node.attribValue, // value
          node.attribValueStartAt, // offset
          {
            permittedValues: ["0", "1"],
            canBeCommaSeparated: false
          }
        );

        console.log(
          `050 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach(errorObj => {
          console.log(`058 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-frameborder"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateFrameborder;
