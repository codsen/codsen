// rule: attribute-validate-frame
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateFrame(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateFrame() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateFrame(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "frame") {
        // validate the parent
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-frame",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // https://www.w3.org/TR/html4/struct/tables.html#adef-frame
        const errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt, // offset
          {
            permittedValues: [
              "void", // No sides. This is the default value.
              "above", // The top side only.
              "below", // The bottom side only.
              "hsides", // The top and bottom sides only.
              "lhs", // The right and left sides only.
              "rhs", // The left-hand side only.
              "vsides", // The right-hand side only.
              "box", // All four sides.
              "border", // All four sides.
            ],
            canBeCommaSeparated: false,
          }
        );

        console.log(
          `056 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`064 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-frame" });
        });
      }
    },
  };
}

export default attributeValidateFrame;
