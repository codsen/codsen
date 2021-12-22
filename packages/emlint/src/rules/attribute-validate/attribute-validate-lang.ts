import { isLangCode } from "is-language-code";

import { Linter, RuleObjType } from "../../linter";
import checkForWhitespace from "../../util/checkForWhitespace";

// rule: attribute-validate-lang
// -----------------------------------------------------------------------------

function attributeValidateLang(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateLang() ███████████████████████████████████████`
      );
      console.log(
        `016 attributeValidateLang(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "lang") {
        // validate the parent
        if (
          [
            "applet",
            "base",
            "basefont",
            "br",
            "frame",
            "frameset",
            "iframe",
            "param",
            "script",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-lang",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // beware, the charStart and charEnd are not offset, their "zero" is
        // start of an attribute's value, so if you use them, you need to
        // offset to the true index, you must add "node.attribValueStartsAt" value
        let { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValueRaw,
          node.attribValueStartsAt as number
        );
        console.log(
          `051 ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
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
          `062 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        // validate using "is-language-code" from npm:
        let { message } = isLangCode(
          node.attribValueRaw.slice(charStart as number, charEnd as number)
        );
        console.log(
          `073 attributeValidateLang(): retrieved ${`\u001b[${33}m${`message`}\u001b[${39}m`} = ${JSON.stringify(
            message,
            null,
            4
          )}`
        );
        if (message) {
          errorArr.push({
            idxFrom:
              (node.attribValueStartsAt as number) + (charStart as number),
            idxTo: (node.attribValueStartsAt as number) + (charEnd as number),
            message,
            fix: null,
          });
        }

        errorArr.forEach((errorObj) => {
          console.log(`090 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-lang" });
        });
      }
    },
  };
}

export default attributeValidateLang;
