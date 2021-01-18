import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-face
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateFace(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateFace() ███████████████████████████████████████`
      );

      console.log(
        `020 attributeValidateFace(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "face") {
        // validate the parent
        if (node.parent.tagName !== "font") {
          context.report({
            ruleId: "attribute-validate-face",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // only validate the whitespace
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValueRaw,
          node.attribValueStartsAt as number
        );
        console.log(
          `${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
            charStart,
            null,
            4
          )}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
            charEnd,
            null,
            4
          )}`
        );
        console.log(
          `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`060 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-face" });
        });
      }
    },
  };
}

// TODO - add more checks from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta

export default attributeValidateFace;
