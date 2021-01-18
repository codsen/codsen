import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-content
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateContent(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateContent() ███████████████████████████████████████`
      );

      console.log(
        `020 attributeValidateContent(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "content") {
        // validate the parent
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-content",
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
          console.log(`064 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-content" });
        });
      }
    },
  };
}

// TODO - add more checks from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta

export default attributeValidateContent;
