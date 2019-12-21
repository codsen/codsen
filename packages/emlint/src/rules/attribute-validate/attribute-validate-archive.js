// rule: attribute-validate-archive
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";
import isUrl from "is-url-superb";

function attributeValidateArchive(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateArchive() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateArchive(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "archive") {
        // validate the parent
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-archive",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // beware, the charStart and charEnd are not offset, their "zero" is
        // start of an attribute's value, so if you use them, you need to
        // offset to the true index, you must add "node.attribValueStartAt" value

        // First we start with whitespace in order to be able to recognise
        // both whitespace and evaluate the value, in the same reporting cycle
        // For example, we'd detect the `<applet archive=" zz">` whitespace
        // and then validate "zz" and report it's not an URI.

        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        console.log(
          `054 ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
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
          `065 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        // validate the URI against the "is-url-superb" from npm

        // spec is different for applet and object tags:
        // archive URL's are comma-separated and object archive URI's are
        // space separated
        let trimmedAttrVal = node.attribValue;
        if (errorArr.length) {
          // only whitespace would be reported so far, so it's a good indicator
          // of inner whitespace
          trimmedAttrVal = node.attribValue.slice(charStart, charEnd);
        }
        console.log(
          `083 ${`\u001b[${33}m${`trimmedAttrVal`}\u001b[${39}m`} = ${JSON.stringify(
            trimmedAttrVal,
            null,
            4
          )}`
        );

        if (node.parent.tagName === "applet") {
          // comma-separated archive list
          trimmedAttrVal.split(",").forEach(uriStr => {
            if (!isUrl(uriStr)) {
              errorArr.push({
                idxFrom: node.attribValueStartAt,
                idxTo: node.attribValueEndAt,
                message: `Should be comma-separated list of URI's.`,
                fix: null
              });
            }
          });
        } else if (node.parent.tagName === "object") {
          // space-separated list of URIs
          trimmedAttrVal.split(" ").forEach(uriStr => {
            if (!isUrl(uriStr)) {
              errorArr.push({
                idxFrom: node.attribValueStartAt,
                idxTo: node.attribValueEndAt,
                message: `Should be space-separated list of URI's.`,
                fix: null
              });
            }
          });
        }

        errorArr.forEach(errorObj => {
          console.log(`117 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-archive"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateArchive;
