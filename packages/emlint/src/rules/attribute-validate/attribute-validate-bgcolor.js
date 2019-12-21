// rule: attribute-validate-bgcolor
// -----------------------------------------------------------------------------

import { validateColor } from "../../util/util";

function attributeValidateBgcolor(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateBgcolor() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
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
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        const errorArr = validateColor(
          node.attribValue,
          node.attribValueStartAt,
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
          `050 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach(errorObj => {
          console.log(`054 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-bgcolor"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateBgcolor;
