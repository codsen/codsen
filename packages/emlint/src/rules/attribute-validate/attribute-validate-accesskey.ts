import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-accesskey
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateAccesskey(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateAccesskey() ███████████████████████████████████████`
      );
      console.log(
        `015 attributeValidateAccesskey(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "accesskey") {
        // validate the parent
        if (
          ![
            "a",
            "area",
            "button",
            "input",
            "label",
            "legend",
            "textarea",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-accesskey",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // only check for rogue whitespace - value can be any string
        const { charStart, charEnd, errorArr, trimmedVal } = checkForWhitespace(
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
        if (typeof charStart === "number" && typeof charEnd === "number") {
          // the value must be a character, raw or escaped, from a document's
          // charset
          // https://www.w3.org/TR/html4/interact/forms.html#adef-accesskey
          if (
            trimmedVal.length > 1 &&
            !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))
          ) {
            errorArr.push({
              idxFrom: (node.attribValueStartsAt as number) + charStart,
              idxTo: (node.attribValueStartsAt as number) + charEnd,
              message: `Should be a single character (escaped or not).`,
              fix: null,
            });
          }
        }

        errorArr.forEach((errorObj) => {
          console.log(`074 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-accesskey",
          });
        });
      }
    },
  };
}

export default attributeValidateAccesskey;
