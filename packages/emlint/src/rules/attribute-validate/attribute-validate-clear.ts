import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-clear
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateClassid(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateClassid() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateClassid(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "clear") {
        // validate the parent
        if (node.parent.tagName !== "br") {
          context.report({
            ruleId: "attribute-validate-clear",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // beware, the charStart and charEnd are not offset, their "zero" is
        // start of an attribute's value, so if you use them, you need to
        // offset to the true index, you must add "(node.attribValueStartsAt as number)" value
        let { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValueRaw,
          node.attribValueStartsAt as number
        );
        DEV &&
          console.log(
            `${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
              charStart,
              null,
              4
            )}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
              charEnd,
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        if (
          typeof charStart === "number" &&
          typeof charEnd === "number" &&
          !["left", "all", "right", "none"].includes(
            context.str.slice(
              (node.attribValueStartsAt as number) + charStart,
              (node.attribValueStartsAt as number) + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: (node.attribValueStartsAt as number) + charStart,
            idxTo: (node.attribValueStartsAt as number) + charEnd,
            message: `Should be: left|all|right|none.`,
            fix: null,
          });
        }

        errorArr.forEach((errorObj) => {
          DEV && console.log(`086 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-clear" });
        });
      }
    },
  };
}

export default attributeValidateClassid;
