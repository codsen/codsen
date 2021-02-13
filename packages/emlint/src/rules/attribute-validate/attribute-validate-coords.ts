import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-coords
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateCoords(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCoords() ███████████████████████████████████████`
      );

      // console.log(
      //   `020 attributeValidateCoords(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "coords") {
        // validate the parent
        if (!["area", "a"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-coords",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          console.log(
            `031 attributeValidateCoords(): ${`\u001b[${33}m${`node.attribValueRaw`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValueRaw,
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
              `${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`} ${`\u001b[${33}m${`shapeAttr`}\u001b[${39}m`} = ${JSON.stringify(
                shapeAttr,
                null,
                4
              )}`
            );

            let enforceCount: null | number | "even" | "odd" = null;
            if (shapeAttr.attribValueRaw === "rect") {
              // enforce the value count to be 4
              enforceCount = 4;
            } else if (shapeAttr.attribValueRaw === "circle") {
              // enforce the value count to be 3
              enforceCount = 3;
            } else if (shapeAttr.attribValueRaw === "poly") {
              // enforce the value count to be an even number
              enforceCount = "even";
            }

            const errorArr = validateDigitAndUnit(
              node.attribValueRaw,
              node.attribValueStartsAt as number,
              {
                whitelistValues: [],
                theOnlyGoodUnits: [],
                badUnits: [],
                noUnitsIsFine: true,
                canBeCommaSeparated: true,
                enforceCount,
                type: "integer",
                customGenericValueError: "Should be integer, no units.",
              }
            );

            if (Array.isArray(errorArr) && errorArr.length) {
              errorArr.forEach((errorObj) => {
                console.log(`096 RAISE ERROR`);
                context.report({
                  ...errorObj,
                  ruleId: "attribute-validate-coords",
                });
              });
            }
          }
        }
      }
    },
  };
}

export default attributeValidateCoords;
