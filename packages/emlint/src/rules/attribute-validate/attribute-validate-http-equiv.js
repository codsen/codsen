// rule: attribute-validate-http-equiv
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateHttpequiv(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHttpequiv() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateHttpequiv(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "http-equiv") {
        // validate the parent
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-http-equiv",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        const errorArr = validateString(
          node.attribValue, // value
          node.attribValueStartAt, // offset
          {
            permittedValues: ["content-type", "default-style", "refresh"],
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
              ruleId: "attribute-validate-http-equiv"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateHttpequiv;
