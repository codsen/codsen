import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-http-equiv
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateHttpequiv(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateHttpequiv() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateHttpequiv(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "http-equiv") {
        // validate the parent
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-http-equiv",
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
            permittedValues: [
              "content-type",
              "default-style",
              "refresh",
              "X-UA-Compatible",
            ],
            canBeCommaSeparated: false,
            caseInsensitive: true,
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
          DEV && console.log(`066 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-http-equiv",
          });
        });
      }
    },
  };
}

export default attributeValidateHttpequiv;
