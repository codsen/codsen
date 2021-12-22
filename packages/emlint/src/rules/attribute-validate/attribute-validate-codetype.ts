import db from "mime-db";

import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-codetype
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateCodetype(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCodetype() ███████████████████████████████████████`
      );

      console.log(
        `018 attributeValidateCodetype(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "codetype") {
        // validate the parent
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-codetype",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        let errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
          {
            quickPermittedValues: [
              "application/javascript",
              "application/json",
              "application/x-www-form-urlencoded",
              "application/xml",
              "application/zip",
              "application/pdf",
              "application/sql",
              "application/graphql",
              "application/ld+json",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-powerpoint",
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              "application/vnd.oasis.opendocument.text",
              "application/zstd",
              "audio/mpeg",
              "audio/ogg",
              "multipart/form-data",
              "text/css",
              "text/html",
              "text/xml",
              "text/csv",
              "text/plain",
              "image/png",
              "image/jpeg",
              "image/gif",
              "application/vnd.api+json",
            ],
            permittedValues: Object.keys(db),
            canBeCommaSeparated: false,
            noSpaceAfterComma: false,
          }
        );
        console.log(
          `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        // HTML attribute accept MIME types as values. Here we reference the given
        // value against all official MIME types, taken from IANA and other sources,
        // https://www.npmjs.com/package/mime-db

        errorArr.forEach((errorObj) => {
          console.log(`090 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-codetype",
          });
        });
      }
    },
  };
}

export default attributeValidateCodetype;
