import { Linter, RuleObjType } from "../../linter";
import validateScript from "../../util/validateScript";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-onsubmit
// -----------------------------------------------------------------------------

function attributeValidateOnsubmit(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateOnsubmit() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `020 attributeValidateOnsubmit(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "onsubmit") {
        // validate the parent
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-onsubmit",
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
              `057 attributeValidateOnsubmit(): received errorArr = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );

          errorArr.forEach((errorObj) => {
            DEV && console.log(`065 attributeValidateOnsubmit(): RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-onsubmit",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateOnsubmit;
