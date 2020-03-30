// rule: attribute-validate-rows
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateRows(context, ...opts) {
  return {
    attribute: function (node) {
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
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        console.log(
          `036 attributeValidateRows(): ${`\u001b[${33}m${`node.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
            node.attribValue,
            null,
            4
          )}`
        );

        let errorArr = [];
        if (node.parent.tagName === "frameset") {
          errorArr = validateDigitAndUnit(
            node.attribValue,
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
            `059 attributeValidateRows(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        } else if (node.parent.tagName === "textarea") {
          // each character must be a digit
          errorArr = validateDigitAndUnit(
            node.attribValue,
            node.attribValueStartsAt,
            {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units.",
            }
          );
          console.log(
            `077 attributeValidateRows(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        }

        if (Array.isArray(errorArr) && errorArr.length) {
          errorArr.forEach((errorObj) => {
            console.log(`087 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-rows",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateRows;
