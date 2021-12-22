import { Linter, RuleObjType } from "../../linter";
import validateScript from "../../util/validateScript";

// rule: attribute-validate-onblur
// -----------------------------------------------------------------------------

function attributeValidateOnblur(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnblur() ███████████████████████████████████████`
      );
      console.log(
        `014 attributeValidateOnblur(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "onblur") {
        // validate the parent
        if (
          ![
            "a",
            "area",
            "button",
            "input",
            "label",
            "select",
            "textarea",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-onblur",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }
        // if value is empty or otherwise does not exist
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
          console.log(
            `057 attributeValidateOnblur(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`065 attributeValidateOnblur(): RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-onblur",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateOnblur;
