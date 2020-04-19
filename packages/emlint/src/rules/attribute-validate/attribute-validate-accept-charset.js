// rule: attribute-validate-accept-charset
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";
import { knownCharsets } from "../../util/constants";

function attributeValidateAcceptCharset(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateAcceptCharset() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateAcceptCharset(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "accept-charset") {
        // validate the parent
        if (!["form"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accept-charset",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // validate against the charsets list from IANA:
        // https://www.iana.org/assignments/character-sets/character-sets.xhtml
        // https://www.w3.org/TR/html4/interact/forms.html#adef-accept-charset
        const errorArr = validateString(
          node.attribValueRaw,
          node.attribValueStartsAt,
          {
            canBeCommaSeparated: true,
            noSpaceAfterComma: true,
            quickPermittedValues: ["UNKNOWN"],
            permittedValues: knownCharsets,
          }
        );
        console.log(
          `054 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`062 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-accept-charset",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateAcceptCharset;
