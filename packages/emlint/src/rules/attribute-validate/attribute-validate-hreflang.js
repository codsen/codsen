// rule: attribute-validate-hreflang
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";
import isLangCode from "is-language-code";

function attributeValidateHreflang(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHreflang() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateHreflang(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "hreflang") {
        // validate the parent
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-hreflang",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // beware, the charStart and charEnd are not offset, their "zero" is
        // start of an attribute's value, so if you use them, you need to
        // offset to the true index, you must add "node.attribValueStartsAt" value
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartsAt
        );
        console.log(
          `048 ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
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
          `059 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        // validate using "ietf-language-tag-regex" from npm:
        const { message } = isLangCode(
          node.attribValue.slice(charStart, charEnd)
        );
        console.log(
          `070 attributeValidateHreflang(): retrieved ${`\u001b[${33}m${`message`}\u001b[${39}m`} = ${JSON.stringify(
            message,
            null,
            4
          )}`
        );
        if (message) {
          errorArr.push({
            idxFrom: node.attribValueStartsAt + charStart,
            idxTo: node.attribValueStartsAt + charEnd,
            message,
            fix: null,
          });
        }

        errorArr.forEach((errorObj) => {
          console.log(`086 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-hreflang",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateHreflang;
