// rule: attribute-validate-enctype
// -----------------------------------------------------------------------------

import db from "mime-db";
import { validateString } from "../../util/util";

function attributeValidateEnctype(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateEnctype() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateEnctype(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "enctype") {
        // validate the parent
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-enctype",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        const errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt, // offset
          {
            quickPermittedValues: [
              "application/x-www-form-urlencoded",
              "multipart/form-data",
              "text/plain",
            ],
            permittedValues: Object.keys(db),
            canBeCommaSeparated: false,
          }
        );

        console.log(
          `056 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`064 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-enctype" });
        });
      }
    },
  };
}

export default attributeValidateEnctype;
