import db from "mime-db";

import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-enctype
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateEnctype(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateEnctype() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `023 attributeValidateEnctype(): node = ${JSON.stringify(
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
        let errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
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

        DEV &&
          console.log(
            `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`067 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-enctype" });
        });
      }
    },
  };
}

export default attributeValidateEnctype;
