import { Linter, RuleObjType } from "../../linter";
import validateScript from "../../util/validateScript";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-onreset
// -----------------------------------------------------------------------------

function attributeValidateOnreset(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateOnreset() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `020 attributeValidateOnreset(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "onreset") {
        // validate the parent
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-onreset",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } // if value is empty or otherwise does not exist
        else if (
          !(node.attribValueStartsAt as number) ||
          !node.attribValueEndsAt
        ) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          // validate the script value
          let errorArr = validateScript(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );
          DEV &&
            console.log(
              `057 attributeValidateOnreset(): received errorArr = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );

          errorArr.forEach((errorObj) => {
            DEV && console.log(`065 attributeValidateOnreset(): RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-onreset",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateOnreset;
