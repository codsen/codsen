import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-longdesc
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateLongdesc(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateLongdesc() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateLongdesc(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "longdesc") {
        // validate the parent
        if (!["img", "frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-longdesc",
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
          // only check for rogue whitespace -
          // TODO - add more rules, https://www.w3schools.com/TagS/att_img_longdesc.asp

          let { errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );
          console.log(
            `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`061 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-longdesc",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateLongdesc;
