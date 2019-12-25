// rule: attribute-validate-codebase
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";
import isUrl from "is-url-superb";

function attributeValidateCodebase(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCodebase() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateCodebase(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "codebase") {
        // validate the parent
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-codebase",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // beware, the charStart and charEnd are not offset, their "zero" is
        // start of an attribute's value, so if you use them, you need to
        // offset to the true index, you must add "node.attribValueStartAt" value
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
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
        // validate the URI against the "is-url-superb" from npm
        if (
          !isUrl(
            context.str.slice(
              node.attribValueStartAt + charStart,
              node.attribValueStartAt + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message: `Should be an URI.`,
            fix: null
          });
        }

        errorArr.forEach(errorObj => {
          console.log(`083 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-codebase"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateCodebase;
