// rule: attribute-validate-for
// -----------------------------------------------------------------------------

import { classNameRegex } from "../../util/constants";
import checkForWhitespace from "../../util/checkForWhitespace";
// import checkClassOrIdValue from "../../util/checkClassOrIdValue";

function attributeValidateFor(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateFor() ███████████████████████████████████████`
      );
      console.log(
        `015 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `022 attributeValidateFor(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "for") {
        // validate the parent
        if (node.parent.tagName !== "label") {
          context.report({
            ruleId: "attribute-validate-for",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt
          );
          console.log(
            `041 \n${`\u001b[${33}m${`node.attribValueStartsAt + charStart`}\u001b[${39}m`} = ${JSON.stringify(
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
            `057 ${`\u001b[${36}m${`traverse and extract id's`}\u001b[${39}m`}`
          );

          const extractedValue = node.attribValueRaw.slice(charStart, charEnd);

          let message = `Wrong id name.`;
          let fix = null;
          let idxFrom = charStart + node.attribValueStartsAt;
          let idxTo = charEnd + node.attribValueStartsAt;
          if (
            Number.isInteger(charStart) &&
            !classNameRegex.test(extractedValue)
          ) {
            if (Array.from(extractedValue).some((val) => !val.trim().length)) {
              message = `Should be one value, no spaces.`;
            } else if (extractedValue.includes("#")) {
              message = `Remove hash.`;
              const firstHashAt = node.attribValueRaw.indexOf("#");
              fix = {
                ranges: [
                  [
                    node.attribValueStartsAt + firstHashAt,
                    node.attribValueStartsAt + firstHashAt + 1,
                  ],
                ],
              };
              idxFrom = node.attribValueStartsAt + firstHashAt;
              idxTo = node.attribValueStartsAt + firstHashAt + 1;
            }

            errorArr.push({
              ruleId: "attribute-validate-for",
              idxFrom,
              idxTo,
              message,
              fix,
            });
          }

          console.log(
            `097 ███████████████████████████████████████\nFINALLY,\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`}:\n${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`105 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-for" });
          });
        }
      }
    },
  };
}

export default attributeValidateFor;
