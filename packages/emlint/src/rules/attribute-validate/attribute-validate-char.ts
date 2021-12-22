import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-char
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateChar(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateChar() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateChar(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "char") {
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
            ruleId: "attribute-validate-char",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-char",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          let { charStart, charEnd, errorArr, trimmedVal } = checkForWhitespace(
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
            // the value must be a character, raw or escaped, from ISO10646
            // https://www.w3.org/TR/html4/sgml/dtd.html#Character
            if (
              trimmedVal.length > 1 &&
              !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))
            ) {
              errorArr.push({
                idxFrom: (node.attribValueStartsAt as number) + charStart,
                idxTo: (node.attribValueStartsAt as number) + charEnd,
                message: `Should be a single character.`,
                fix: null,
              });
            }
          }

          errorArr.forEach((errorObj) => {
            console.log(`080 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-char" });
          });
        }
      }
    },
  };
}

export default attributeValidateChar;
