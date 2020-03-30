// rule: attribute-validate-rel
// -----------------------------------------------------------------------------

import { validateString, linkTypes } from "../../util/util";

function attributeValidateRel(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateRel() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateRel(): node = ${JSON.stringify(node, null, 4)}`
      );

      const caseInsensitive =
        !Array.isArray(opts) || !opts.includes(`enforceLowercase`);

      if (node.attribName === "rel") {
        // validate the parent
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rel",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        const errorArr = validateString(
          node.attribValue, // value
          node.attribValueStartsAt, // offset
          {
            permittedValues: linkTypes,
            canBeCommaSeparated: false,
            caseInsensitive,
          }
        );

        console.log(
          `050 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`058 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-rel",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateRel;
