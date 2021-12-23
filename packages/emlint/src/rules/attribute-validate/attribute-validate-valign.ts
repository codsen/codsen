import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-valign
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateValign(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateValign() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateValign(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
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
            DEV && console.log(`058 RAISE ERROR`);
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
