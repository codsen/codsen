import { Linter, RuleObjType } from "../../linter";
import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-object
// -----------------------------------------------------------------------------

function attributeValidateObject(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateObject() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `020 attributeValidateObject(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "object") {
        // validate the parent
        if (node.parent.tagName !== "applet") {
          context.report({
            ruleId: "attribute-validate-object",
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
            DEV && console.log(`064 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-object",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateObject;
