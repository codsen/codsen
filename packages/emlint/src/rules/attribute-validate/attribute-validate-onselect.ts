import { Linter, RuleObjType } from "../../linter";
import validateScript from "../../util/validateScript";

// rule: attribute-validate-onselect
// -----------------------------------------------------------------------------

function attributeValidateOnselect(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnselect() ███████████████████████████████████████`
      );

      console.log(
        `015 attributeValidateOnselect(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "onselect") {
        // validate the parent
        if (!["input", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onselect",
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
          const errorArr = validateScript(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );
          console.log(
            `051 attributeValidateOnselect(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`059 attributeValidateOnselect(): RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-onselect",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateOnselect;
