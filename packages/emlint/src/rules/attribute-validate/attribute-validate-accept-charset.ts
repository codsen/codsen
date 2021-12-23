import { Linter, RuleObjType } from "../../linter";
import { validateString } from "../../util/util";
import { knownCharsets } from "../../util/constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-accept-charset
// -----------------------------------------------------------------------------

function attributeValidateAcceptCharset(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateAcceptCharset() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `020 attributeValidateAcceptCharset(): node = ${JSON.stringify(
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
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // validate against the charsets list from IANA:
        // https://www.iana.org/assignments/character-sets/character-sets.xhtml
        // https://www.w3.org/TR/html4/interact/forms.html#adef-accept-charset
        let errorArr = validateString(
          node.attribValueRaw,
          node.attribValueStartsAt as number,
          {
            canBeCommaSeparated: true,
            noSpaceAfterComma: true,
            quickPermittedValues: ["UNKNOWN"],
            permittedValues: knownCharsets,
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
          DEV && console.log(`062 RAISE ERROR`);
          context.report({
            ...errorObj,
            ruleId: "attribute-validate-accept-charset",
          });
        });
      }
    },
  };
}

export default attributeValidateAcceptCharset;
