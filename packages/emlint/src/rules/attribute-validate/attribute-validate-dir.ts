import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-dir
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateDir(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateDir() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateDir(): node = ${JSON.stringify(node, null, 4)}`
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

        DEV &&
          console.log(
            `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`068 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-dir" });
        });
      }
    },
  };
}

export default attributeValidateDir;
