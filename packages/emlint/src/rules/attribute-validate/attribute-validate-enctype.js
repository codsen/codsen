// rule: attribute-validate-enctype
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";
import db from "mime-db";

function attributeValidateEnctype(context, ...opts) {
  return {
    attribute: function(node) {
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
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        const errorArr = validateString(
          node.attribValue, // value
          node.attribValueStartAt, // offset
          {
            quickPermittedValues: [
              "application/x-www-form-urlencoded",
              "multipart/form-data",
              "text/plain"
            ],
            permittedValues: Object.keys(db),
            canBeCommaSeparated: false
          }
        );

        console.log(
          `056 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach(errorObj => {
          console.log(`064 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-enctype"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateEnctype;
