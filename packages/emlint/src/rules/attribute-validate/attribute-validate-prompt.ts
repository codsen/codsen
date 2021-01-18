import { Linter, RuleObjType } from "../../linter";
import checkForWhitespace from "../../util/checkForWhitespace";

// rule: attribute-validate-prompt
// -----------------------------------------------------------------------------

function attributeValidatePrompt(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidatePrompt() ███████████████████████████████████████`
      );

      console.log(
        `020 attributeValidatePrompt(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "prompt") {
        // validate the parent
        if (node.parent.tagName !== "isindex") {
          context.report({
            ruleId: "attribute-validate-prompt",
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
          // only check for rogue whitespace - value can be any CDATA
          const { errorArr } = checkForWhitespace(
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
            console.log(`059 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-prompt",
            });
          });
        }
      }
    },
  };
}

export default attributeValidatePrompt;
