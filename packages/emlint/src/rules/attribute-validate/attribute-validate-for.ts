import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-for
// -----------------------------------------------------------------------------

import { classNameRegex } from "../../util/constants";
import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;
// import checkClassOrIdValue from "../../util/checkClassOrIdValue";

function attributeValidateFor(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateFor() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `023 attributeValidateFor(): node = ${JSON.stringify(node, null, 4)}`
        );

      if (node.attribName === "for") {
        // validate the parent
        if (node.parent.tagName !== "label") {
          context.report({
            ruleId: "attribute-validate-for",
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
          let { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );

          if (typeof charStart === "number" && typeof charEnd === "number") {
            DEV &&
              console.log(
                `058 \n${`\u001b[${33}m${`(node.attribValueStartsAt as number) + charStart`}\u001b[${39}m`} = ${JSON.stringify(
                  (node.attribValueStartsAt as number) + charStart,
                  null,
                  4
                )}; \n${`\u001b[${33}m${`(node.attribValueStartsAt as number) + charEnd`}\u001b[${39}m`} = ${JSON.stringify(
                  (node.attribValueStartsAt as number) + charEnd,
                  null,
                  4
                )}; \n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                  errorArr,
                  null,
                  4
                )}`
              );

            DEV &&
              console.log(
                `${`\u001b[${36}m${`traverse and extract id's`}\u001b[${39}m`}`
              );

            let extractedValue = node.attribValueRaw.slice(charStart, charEnd);

            let message = `Wrong id name.`;
            let fix = null;
            let idxFrom = charStart + (node.attribValueStartsAt as number);
            let idxTo = charEnd + (node.attribValueStartsAt as number);
            if (
              Number.isInteger(charStart) &&
              !classNameRegex.test(extractedValue)
            ) {
              if (
                Array.from(extractedValue).some((val) => !val.trim().length)
              ) {
                message = `Should be one value, no spaces.`;
              } else if (extractedValue.includes("#")) {
                message = `Remove hash.`;
                let firstHashAt = node.attribValueRaw.indexOf("#");
                fix = {
                  ranges: [
                    [
                      (node.attribValueStartsAt as number) + firstHashAt,
                      (node.attribValueStartsAt as number) + firstHashAt + 1,
                    ],
                  ],
                };
                idxFrom = (node.attribValueStartsAt as number) + firstHashAt;
                idxTo = (node.attribValueStartsAt as number) + firstHashAt + 1;
              }

              errorArr.push({
                ruleId: "attribute-validate-for",
                idxFrom,
                idxTo,
                message,
                fix: fix as any,
              });
            }
          }

          DEV &&
            console.log(
              `119 ███████████████████████████████████████\nFINALLY,\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`}:\n${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );

          errorArr.forEach((errorObj) => {
            DEV && console.log(`127 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-for" });
          });
        }
      }
    },
  };
}

export default attributeValidateFor;
