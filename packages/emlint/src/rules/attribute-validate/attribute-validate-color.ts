import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-color
// -----------------------------------------------------------------------------

import validateColor from "../../util/validateColor";

function attributeValidateColor(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateColor() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateColor(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "color") {
        // validate the parent
        if (!["basefont", "font"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-color",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-color",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          let errorArr = validateColor(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              namedCssLevel1OK: true,
              namedCssLevel2PlusOK: true,
              hexThreeOK: false,
              hexFourOK: false,
              hexSixOK: true,
              hexEightOK: false,
            }
          );
          console.log(
            `054 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`058 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-color" });
          });
        }
      }
    },
  };
}

export default attributeValidateColor;
