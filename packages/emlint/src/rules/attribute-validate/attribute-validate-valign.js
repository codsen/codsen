// rule: attribute-validate-valign
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateValign(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateValign() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateValign(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "valign") {
        // validate the parent
        if (
          ![
            "col",
            "colgroup",
            "tbody",
            "td",
            "tfoot",
            "th",
            "thead",
            "tr",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-valign",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          validateString(
            node.attribValue, // value
            node.attribValueStartsAt, // offset
            {
              permittedValues: ["top", "middle", "bottom", "baseline"],
              canBeCommaSeparated: false,
            }
          ).forEach((errorObj) => {
            console.log(`053 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-valign",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateValign;
