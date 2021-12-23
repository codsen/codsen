import { Linter, RuleObjType } from "../../linter";
import validateScript from "../../util/validateScript";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-onunload
// -----------------------------------------------------------------------------

function attributeValidateOnunload(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateOnunload() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `020 attributeValidateOnunload(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "onunload") {
        // validate the parent
        if (!["frameset", "body"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onunload",
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
              `057 attributeValidateOnunload(): received errorArr = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );

          errorArr.forEach((errorObj) => {
            DEV && console.log(`065 attributeValidateOnunload(): RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-onunload",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateOnunload;
