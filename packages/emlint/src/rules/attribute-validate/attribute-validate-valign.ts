import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-valign
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateValign(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateValign() ███████████████████████████████████████`
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
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              permittedValues: ["top", "middle", "bottom", "baseline"],
              canBeCommaSeparated: false,
            }
          ).forEach((errorObj) => {
            console.log(`053 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-valign",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateValign;
