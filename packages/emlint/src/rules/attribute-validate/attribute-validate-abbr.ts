import { Linter, RuleObjType } from "../../linter";
import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-abbr
// -----------------------------------------------------------------------------

function attributeValidateAbbr(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateAbbr() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `019 attributeValidateAbbr(): node = ${JSON.stringify(node, null, 4)}`
        );

      if (node.attribName === "abbr") {
        // validate the parent
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-abbr",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // only check for rogue whitespace - value can be any string
        let { errorArr } = checkForWhitespace(
          node.attribValueRaw,
          node.attribValueStartsAt as number
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
          DEV && console.log(`049 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-abbr" });
        });
      }
    },
  };
}

export default attributeValidateAbbr;
