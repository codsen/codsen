// rule: attribute-validate-text
// -----------------------------------------------------------------------------

import validateColor from "../../util/validateColor";

function attributeValidateText(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateText() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
      //   `015 attributeValidateText(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "text") {
        // validate the parent
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-text",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        const errorArr = validateColor(
          node.attribValue,
          node.attribValueStartsAt,
          {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          }
        );
        console.log(
          `048 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`052 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-text"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateText;
