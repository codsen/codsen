// rule: attribute-validate-scrolling
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateScrolling(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateScrolling() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateScrolling(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "scrolling") {
        // validate the parent
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-scrolling",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        const errorArr = validateString(
          node.attribValue, // value
          node.attribValueStartsAt, // offset
          {
            permittedValues: ["auto", "yes", "no"],
            canBeCommaSeparated: false
          }
        );

        console.log(
          `049 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach(errorObj => {
          console.log(`057 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-scrolling"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateScrolling;
