import { Linter, RuleObjType } from "../../linter";
import { validateString, linkTypes } from "../../util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-rel
// -----------------------------------------------------------------------------

function attributeValidateRel(
  context: Linter,
  enforceLowercase = false
): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateRel() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `023 attributeValidateRel(): node = ${JSON.stringify(node, null, 4)}`
        );

      if (node.attribName === "rel") {
        // validate the parent
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rel",
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
            permittedValues: linkTypes,
            canBeCommaSeparated: false,
            caseInsensitive: !enforceLowercase,
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
          DEV && console.log(`059 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-rel" });
        });
      }
    },
  };
}

export default attributeValidateRel;
