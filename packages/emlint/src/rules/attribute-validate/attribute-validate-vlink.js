// rule: attribute-validate-vlink
// -----------------------------------------------------------------------------

import validateColor from "../../util/validateColor";

function attributeValidateVlink(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateVlink() ███████████████████████████████████████`
      );
      console.log(
        `013 attributeValidateVlink(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
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
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
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
            node.attribValueStartsAt,
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
