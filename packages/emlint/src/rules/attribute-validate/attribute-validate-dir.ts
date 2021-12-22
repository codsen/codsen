import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-dir
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

function attributeValidateDir(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateDir() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateDir(): node = ${JSON.stringify(node, null, 4)}`
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
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        let errorArr = validateString(
          node.attribValueRaw, // value
          node.attribValueStartsAt as number, // offset
          {
            permittedValues: ["ltr", "rtl"],
            canBeCommaSeparated: false,
          }
        );

        console.log(
          `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`062 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-dir" });
        });
      }
    },
  };
}

export default attributeValidateDir;
