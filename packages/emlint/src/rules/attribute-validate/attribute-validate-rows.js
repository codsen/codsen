// rule: attribute-validate-rows
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateRows(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateRows() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
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

        console.log(
          `036 attributeValidateRows(): ${`\u001b[${33}m${`node.attribValueRaw`}\u001b[${39}m`} = ${JSON.stringify(
            node.attribValueRaw,
            null,
            4
          )}`
        );

        let errorArr = [];
        // if value is empty or otherwise does not exist
        if (!node.attribValueStartsAt || !node.attribValueEndsAt) {
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
            node.attribValueStartsAt,
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
          console.log(
            `068 attributeValidateRows(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        } else if (node.parent.tagName === "textarea") {
          // each character must be a digit
          errorArr = validateDigitAndUnit(
            node.attribValueRaw,
            node.attribValueStartsAt,
            {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units.",
            }
          );
          console.log(
            `086 attributeValidateRows(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        }

        if (Array.isArray(errorArr) && errorArr.length) {
          errorArr.forEach((errorObj) => {
            console.log(`096 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-rows" });
          });
        }
      }
    },
  };
}

export default attributeValidateRows;
