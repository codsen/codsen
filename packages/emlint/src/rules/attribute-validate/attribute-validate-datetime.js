// rule: attribute-validate-datetime
// -----------------------------------------------------------------------------

import { validateString, isoDateRegex } from "../../util/util";

function attributeValidateDatetime(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateDatetime() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateDatetime(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "datetime") {
        // validate the parent
        if (!["del", "ins"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-datetime",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        const errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt, // offset
          {
            quickPermittedValues: [isoDateRegex],
            permittedValues: null,
            canBeCommaSeparated: false,
            noSpaceAfterComma: false,
          }
        );
        console.log(
          `051 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        // HTML attribute accept MIME types as values. Here we reference the given
        // value against all official MIME types, taken from IANA and other sources,
        // https://www.npmjs.com/package/mime-db

        errorArr.forEach((errorObj) => {
          console.log(`062 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-datetime",
          });
        });
      }
    },
  };
}

export default attributeValidateDatetime;
