import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-bgcolor
// -----------------------------------------------------------------------------

import validateColor from "../../util/validateColor";

function attributeValidateBgcolor(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateBgcolor() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateBgcolor(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "bgcolor") {
        // validate the parent
        if (
          !["table", "tr", "td", "th", "body"].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-bgcolor",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-bgcolor",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          const errorArr = validateColor(
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
            `060 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`064 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-bgcolor",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateBgcolor;
