import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-scrolling
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateScrolling(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateScrolling() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateScrolling(): node = ${JSON.stringify(
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
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        const errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
          {
            permittedValues: ["auto", "yes", "no"],
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
          console.log(`053 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-scrolling",
          });
        });
      }
    },
  };
}

export default attributeValidateScrolling;
