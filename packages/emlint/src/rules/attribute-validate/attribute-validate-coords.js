// rule: attribute-validate-coords
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateCoords(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCoords() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
      //   `020 attributeValidateCoords(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "coords") {
        // validate the parent
        if (!["area", "a"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-coords",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          console.log(
            `035 attributeValidateCoords(): ${`\u001b[${33}m${`node.attribValue`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValue,
              null,
              4
            )}`
          );

          // "coords" values depend on "shape" attribute's value
          if (
            !Array.isArray(node.parent.attribs) ||
            !node.parent.attribs.length ||
            !node.parent.attribs.some(
              (attrObj) => attrObj.attribName === "shape"
            )
          ) {
            // enforce "shape" attribute
            context.report({
              ruleId: "attribute-validate-coords",
              idxFrom: node.parent.start,
              idxTo: node.parent.end,
              message: `Missing "shape" attribute.`,
              fix: null,
            });
          } else {
            // extract "shape" attr's value
            const shapeAttr = node.parent.attribs.filter(
              (attrObj) => attrObj.attribName === "shape"
            )[0];
            console.log(
              `064 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`} ${`\u001b[${33}m${`shapeAttr`}\u001b[${39}m`} = ${JSON.stringify(
                shapeAttr,
                null,
                4
              )}`
            );

            let enforceCount = null;
            if (shapeAttr.attribValue === "rect") {
              // enforce the value count to be 4
              enforceCount = 4;
            } else if (shapeAttr.attribValue === "circle") {
              // enforce the value count to be 3
              enforceCount = 3;
            } else if (shapeAttr.attribValue === "poly") {
              // enforce the value count to be an even number
              enforceCount = "even";
            }

            const errorArr = validateDigitAndUnit(
              node.attribValue,
              node.attribValueStartsAt,
              {
                whitelistValues: null,
                theOnlyGoodUnits: [],
                badUnits: null,
                noUnitsIsFine: true,
                canBeCommaSeparated: true,
                enforceCount,
                type: "integer",
                customGenericValueError: "Should be integer, no units.",
              }
            );

            if (Array.isArray(errorArr) && errorArr.length) {
              errorArr.forEach((errorObj) => {
                console.log(`100 RAISE ERROR`);
                context.report(
                  Object.assign({}, errorObj, {
                    ruleId: "attribute-validate-coords",
                  })
                );
              });
            }
          }
        }
      }
    },
  };
}

export default attributeValidateCoords;
