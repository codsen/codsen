// rule: attribute-validate-rules
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateRules(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateRules() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateRules(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "rules") {
        // validate the parent
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-rules",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // https://www.w3.org/TR/html4/struct/tables.html#adef-frame
        const errorArr = validateString(
          node.attribValue, // value
          node.attribValueStartAt, // offset
          {
            permittedValues: ["none", "groups", "rows", "cols", "all"],
            canBeCommaSeparated: false
          }
        );

        console.log(
          `046 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach(errorObj => {
          console.log(`054 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-rules"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateRules;
