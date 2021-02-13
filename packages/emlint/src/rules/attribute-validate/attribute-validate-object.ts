import { Linter, RuleObjType } from "../../linter";
import checkForWhitespace from "../../util/checkForWhitespace";

// rule: attribute-validate-object
// -----------------------------------------------------------------------------

function attributeValidateObject(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateObject() ███████████████████████████████████████`
      );

      console.log(
        `015 attributeValidateObject(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "object") {
        // validate the parent
        if (node.parent.tagName !== "applet") {
          context.report({
            ruleId: "attribute-validate-object",
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
            console.log(`054 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-object",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateObject;
