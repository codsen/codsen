import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-name
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateName(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateName() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateName(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "name") {
        // validate the parent
        if (
          ![
            "button",
            "textarea",
            "applet",
            "select",
            "form",
            "frame",
            "iframe",
            "img",
            "a",
            "input",
            "object",
            "map",
            "param",
            "meta",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-name",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          // only check for rogue whitespace because value can be any CDATA
          let { errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );
          console.log(
            `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
          errorArr.forEach((errorObj) => {
            console.log(`071 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-name" });
          });
        }
      }
    },
  };
}

export default attributeValidateName;
