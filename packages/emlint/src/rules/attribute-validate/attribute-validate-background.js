// rule: attribute-validate-background
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";
import isUrl from "is-url-superb";

function attributeValidateBackground(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateBackground() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateBackground(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "background") {
        // validate the parent
        if (!["body", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-background",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // beware, the charStart and charEnd are not offset, their "zero" is
        // start of an attribute's value, so if you use them, you need to
        // offset to the true index, you must add "node.attribValueStartAt" value
        const { charStart, charEnd, errorArr, trimmedVal } = checkForWhitespace(
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
        console.log(`065 ██ isUrl: ${isUrl(trimmedVal)}`);

        // validate the URI against the "is-url-superb" from npm
        if (!isUrl(trimmedVal)) {
          // so it's not an URL
          // maybe it's local file name
          if (
            !Array.from(trimmedVal).some(char => !char.trim().length) &&
            /\w\.\w/.test(trimmedVal) &&
            /[^\\/]+$/.test(trimmedVal)
          ) {
            // so it resembles a local file name
            if (!(Array.isArray(opts) && opts.includes("localOK"))) {
              errorArr.push({
                idxFrom: node.attribValueStartAt + charStart,
                idxTo: node.attribValueStartAt + charEnd,
                message: `Should be an external URI.`,
                fix: null
              });
            }
          } else {
            // it's not local file name either - just mention "official" req.,
            // the attribute's value must be an URI
            errorArr.push({
              idxFrom: node.attribValueStartAt + charStart,
              idxTo: node.attribValueStartAt + charEnd,
              message: `Should be an URI.`,
              fix: null
            });
          }
        }

        errorArr.forEach(errorObj => {
          console.log(`098 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-background"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateBackground;
