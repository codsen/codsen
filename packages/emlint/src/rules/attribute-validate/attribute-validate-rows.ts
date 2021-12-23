import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";

// rule: attribute-validate-rows
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateRows(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateRows() ███████████████████████████████████████`
        );

      // DEV && console.log(
      //   `015 attributeValidateRows(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "rows") {
        // validate the parent
        if (!["frameset", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rows",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        DEV &&
          console.log(
            `038 attributeValidateRows(): ${`\u001b[${33}m${`node.attribValueRaw`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValueRaw,
              null,
              4
            )}`
          );

        let errorArr: ErrorObj[] = [];
        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else if (node.parent.tagName === "frameset") {
          errorArr = validateDigitAndUnit(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              whitelistValues: ["*"],
              theOnlyGoodUnits: ["%"],
              badUnits: ["px"],
              noUnitsIsFine: true,
              canBeCommaSeparated: true,
              type: "rational",
              customGenericValueError: "Should be: pixels|%|*.",
            }
          );
          DEV &&
            console.log(
              `071 attributeValidateRows(): received errorArr = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );
        } else if (node.parent.tagName === "textarea") {
          // each character must be a digit
          errorArr = validateDigitAndUnit(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units.",
            }
          );
          DEV &&
            console.log(
              `090 attributeValidateRows(): received errorArr = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );
        }

        if (Array.isArray(errorArr) && errorArr.length) {
          errorArr.forEach((errorObj) => {
            DEV && console.log(`100 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-rows" });
          });
        }
      }
    },
  };
}

export default attributeValidateRows;
