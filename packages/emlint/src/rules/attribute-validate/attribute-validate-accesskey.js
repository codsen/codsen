// rule: attribute-validate-accesskey
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateAccesskey(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateAccesskey() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateAccesskey(): node = ${JSON.stringify(
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
            "textarea"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-accesskey",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // only check for rogue whitespace - value can be any string
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        console.log(
          `055 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        if (Number.isInteger(charStart)) {
          // the value must be a character, raw or escaped, form a document's
          // charset
          // https://www.w3.org/TR/html4/interact/forms.html#adef-accesskey
          const extractedValue = context.str.slice(
            node.attribValueStartAt + charStart,
            node.attribValueStartAt + charEnd
          );
          console.log(
            `${`\u001b[${33}m${`extractedValue`}\u001b[${39}m`} = ${JSON.stringify(
              extractedValue,
              null,
              4
            )}`
          );
          if (
            extractedValue.length > 1 &&
            !(extractedValue.startsWith("&") && extractedValue.endsWith(";"))
          ) {
            errorArr.push({
              idxFrom: node.attribValueStartAt + charStart,
              idxTo: node.attribValueStartAt + charEnd,
              message: `Should be a single character (escaped or not).`,
              fix: null
            });
          }
        }

        errorArr.forEach(errorObj => {
          console.log(`090 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-accesskey"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateAccesskey;
