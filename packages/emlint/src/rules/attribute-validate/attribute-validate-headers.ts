import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-headers
// -----------------------------------------------------------------------------

import checkClassOrIdValue from "../../util/checkClassOrIdValue";
import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateHeaders(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateHeaders() ███████████████████████████████████████`
      );

      console.log(
        `017 attributeValidateHeaders(): node = ${JSON.stringify(
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
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }
        // if value is empty or otherwise does not exist
        else if (
          !(node.attribValueStartsAt as number) ||
          !node.attribValueEndsAt
        ) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );
          console.log(
            `053 \n${`\u001b[${33}m${`(node.attribValueStartsAt as number) + charStart`}\u001b[${39}m`} = ${JSON.stringify(
              ((node.attribValueStartsAt as number) +
                (charStart as number)) as number,
              null,
              4
            )}; \n${`\u001b[${33}m${`(node.attribValueStartsAt as number) + charEnd`}\u001b[${39}m`} = ${JSON.stringify(
              ((node.attribValueStartsAt as number) +
                (charEnd as number)) as number,
              null,
              4
            )}; \n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          console.log(
            `${`\u001b[${36}m${`traverse and extract id's`}\u001b[${39}m`}`
          );

          checkClassOrIdValue(
            context.str,
            {
              typeName: "id", // class|id|for
              from: ((node.attribValueStartsAt as number) +
                (charStart as number)) as number,
              to: ((node.attribValueStartsAt as number) +
                (charEnd as number)) as number,
              offset: 0,
            },
            errorArr // might be mutated, more errors pushed into
          );

          console.log(
            `088 ███████████████████████████████████████\nFINALLY,\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`}:\n${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`096 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-headers",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateHeaders;
