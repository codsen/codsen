import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-alink
// -----------------------------------------------------------------------------

import validateColor from "../../util/validateColor";

function attributeValidateAlink(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateAlink() ███████████████████████████████████████`
      );
      // console.log(
      //   `015 attributeValidateAlink(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "alink") {
        // validate the parent
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-alink",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-alink",
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
            `053 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`057 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-alink" });
          });
        }
      }
    },
  };
}

export default attributeValidateAlink;
