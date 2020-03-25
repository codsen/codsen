// rule: attribute-validate-scope
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateScope(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateScope() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateScope(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "scope") {
        // validate the parent
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-scope",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null,
          });
        }

        const errorArr = validateString(
          node.attribValue, // value
          node.attribValueStartsAt, // offset
          {
            permittedValues: ["row", "col", "rowgroup", "colgroup"],
            canBeCommaSeparated: false,
          }
        );

        console.log(
          `045 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`053 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-scope",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateScope;
