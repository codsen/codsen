import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-charset
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";
import { knownCharsets } from "../../util/constants";

function attributeValidateCharset(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCharset() ███████████████████████████████████████`
      );

      console.log(
        `017 attributeValidateCharset(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "charset") {
        // validate the parent
        if (!["a", "link", "script", "meta"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-charset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-charset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          // validate against the charsets list from IANA:
          // https://www.iana.org/assignments/character-sets/character-sets.xhtml
          // https://www.w3.org/TR/html4/interact/forms.html#adef-charset
          const errorArr = validateString(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              canBeCommaSeparated: false,
              noSpaceAfterComma: false,
              quickPermittedValues: [],
              permittedValues: knownCharsets,
            }
          );
          console.log(
            `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`068 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-charset",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateCharset;
