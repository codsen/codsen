import { Linter, RuleObjType } from "../../linter";
import { validateString, linkTypes } from "../../util/util";

// rule: attribute-validate-rel
// -----------------------------------------------------------------------------

function attributeValidateRel(
  context: Linter,
  enforceLowercase = false
): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateRel() ███████████████████████████████████████`
      );

      console.log(
        `018 attributeValidateRel(): node = ${JSON.stringify(node, null, 4)}`
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

        console.log(
          `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`053 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-rel" });
        });
      }
    },
  };
}

export default attributeValidateRel;
