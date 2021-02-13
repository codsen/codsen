import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-datetime
// -----------------------------------------------------------------------------

import { validateString, isoDateRegex } from "../../util/util";

function attributeValidateDatetime(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateDatetime() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateDatetime(): node = ${JSON.stringify(
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
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        const errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
          {
            quickPermittedValues: [isoDateRegex],

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
          console.log(`058 RAISE ERROR`);
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
