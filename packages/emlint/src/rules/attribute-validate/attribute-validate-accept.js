// rule: attribute-validate-accept
// -----------------------------------------------------------------------------

import { validateString, wholeExtensionRegex } from "../../util/util";
import db from "mime-db";

function attributeValidateAccept(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateAccept() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateAccept(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "accept") {
        // validate the parent
        if (!["form", "input"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accept",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        const errorArr = validateString(
          node.attribValue, // value
          node.attribValueStartsAt, // offset
          {
            quickPermittedValues: [
              "audio/*",
              "video/*",
              "image/*",
              "text/html",
              "image/png",
              "image/gif",
              "video/mpeg",
              "text/css",
              "audio/basic",
              wholeExtensionRegex,
            ],
            permittedValues: Object.keys(db),
            canBeCommaSeparated: true,
            noSpaceAfterComma: true,
          }
        );
        console.log(
          `059 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        // HTML attribute accept MIME types as values. Here we reference the given
        // value against all official MIME types, taken from IANA and other sources,
        // https://www.npmjs.com/package/mime-db

        errorArr.forEach((errorObj) => {
          console.log(`070 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-accept",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateAccept;
