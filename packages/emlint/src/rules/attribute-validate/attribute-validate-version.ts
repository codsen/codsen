import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-version
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateVersion(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateVersion() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateVersion(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "version") {
        // validate the parent
        if (node.parent.tagName !== "html") {
          context.report({
            ruleId: "attribute-validate-version",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          // only check for rogue whitespace - value can be any CDATA
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
            DEV && console.log(`065 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-version",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateVersion;
