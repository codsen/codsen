import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-target
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateTarget(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateTarget() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateTarget(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "target") {
        // validate the parent
        if (
          !["a", "area", "base", "form", "link"].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-target",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          // only check for rogue whitespace because value can be any CDATA
          let { errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );
          console.log(
            `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`057 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-target",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateTarget;
