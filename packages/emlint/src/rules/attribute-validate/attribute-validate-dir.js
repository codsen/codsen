// rule: attribute-validate-dir
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateDir(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateDir() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateDir(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "dir") {
        // validate the parent
        if (
          [
            "applet",
            "base",
            "basefont",
            "br",
            "frame",
            "frameset",
            "iframe",
            "param",
            "script",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-dir",
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
            permittedValues: ["ltr", "rtl"],
            canBeCommaSeparated: false,
          }
        );

        console.log(
          `058 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`066 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-dir",
            })
          );
        });
      }
    },
  };
}

export default attributeValidateDir;
