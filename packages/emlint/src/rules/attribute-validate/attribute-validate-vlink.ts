import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-vlink
// -----------------------------------------------------------------------------

import validateColor from "../../util/validateColor";

function attributeValidateVlink(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateVlink() ███████████████████████████████████████`
      );
      console.log(
        `020 attributeValidateVlink(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "vlink") {
        // validate the parent
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-vlink",
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
          console.log(
            `046 attributeValidateVlink(): value exists so let's validate it`
          );
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
            `061 attributeValidateVlink(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`069 attributeValidateVlink(): RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-vlink" });
          });
        }
      }
    },
  };
}

export default attributeValidateVlink;
