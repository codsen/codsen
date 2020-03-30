// rule: attribute-validate-headers
// -----------------------------------------------------------------------------

import checkClassOrIdValue from "../../util/checkClassOrIdValue";
import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateHeaders(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHeaders() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateHeaders(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "headers") {
        // validate the parent
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-headers",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValue,
            node.attribValueStartsAt
          );
          console.log(
            `044 \n${`\u001b[${33}m${`node.attribValueStartsAt + charStart`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValueStartsAt + charStart,
              null,
              4
            )}; \n${`\u001b[${33}m${`node.attribValueStartsAt + charEnd`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValueStartsAt + charEnd,
              null,
              4
            )}; \n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          console.log(
            `060 ${`\u001b[${36}m${`traverse and extract id's`}\u001b[${39}m`}`
          );

          checkClassOrIdValue(
            context.str,
            {
              typeName: "id", // class|id|for
              from: node.attribValueStartsAt + charStart,
              to: node.attribValueStartsAt + charEnd,
              offset: 0,
            },
            errorArr // might be mutated, more errors pushed into
          );

          console.log(
            `075 ███████████████████████████████████████\nFINALLY,\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`}:\n${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`083 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-headers",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateHeaders;
