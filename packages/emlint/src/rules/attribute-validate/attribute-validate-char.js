// rule: attribute-validate-char
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateChar(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateChar() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateChar(): node = ${JSON.stringify(node, null, 4)}`
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
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        const { charStart, charEnd, errorArr, trimmedVal } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartsAt
        );
        console.log(
          `051 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        if (Number.isInteger(charStart)) {
          // the value must be a character, raw or escaped, from ISO10646
          // https://www.w3.org/TR/html4/sgml/dtd.html#Character
          if (
            trimmedVal.length > 1 &&
            !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))
          ) {
            errorArr.push({
              idxFrom: node.attribValueStartsAt + charStart,
              idxTo: node.attribValueStartsAt + charEnd,
              message: `Should be a single character.`,
              fix: null,
            });
          }
        }

        errorArr.forEach((errorObj) => {
          console.log(`074 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-char",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateChar;
