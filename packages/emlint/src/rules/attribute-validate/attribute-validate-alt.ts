import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-alt
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateAlt(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateAlt() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateAlt(): node = ${JSON.stringify(node, null, 4)}`
        );

      if (node.attribName === "alt") {
        // validate the parent
        if (!["applet", "area", "img", "input"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-alt",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        if (
          node.attribValueStartsAt !== null &&
          node.attribValueEndsAt !== null
        ) {
          // only check for rogue whitespace - value can be any CDATA
          let { errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt
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
            DEV && console.log(`055 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-alt" });
          });
        }
      }
    },
  };
}

export default attributeValidateAlt;
