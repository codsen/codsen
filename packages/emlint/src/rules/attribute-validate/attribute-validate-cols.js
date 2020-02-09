// rule: attribute-validate-cols
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateCols(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCols() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
      //   `015 attributeValidateCols(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "cols") {
        // validate the parent
        if (!["frameset", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-cols",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        console.log(
          `036 attributeValidateCols(): ${`\u001b[${33}m${`node.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
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
              customGenericValueError: "Should be: pixels|%|*."
            }
          );
          console.log(
            `059 attributeValidateCols(): received errorArr = ${JSON.stringify(
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
              customGenericValueError: "Should be integer, no units."
            }
          );
          console.log(
            `077 attributeValidateCols(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        }

        if (Array.isArray(errorArr) && errorArr.length) {
          errorArr.forEach(errorObj => {
            console.log(`087 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-cols"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateCols;
