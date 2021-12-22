import { Linter, RuleObjType } from "../../linter";
import validateScript from "../../util/validateScript";

// rule: attribute-validate-onkeyup
// -----------------------------------------------------------------------------

function attributeValidateOnkeyup(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnkeyup() ███████████████████████████████████████`
      );

      console.log(
        `015 attributeValidateOnkeyup(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "onkeyup") {
        // validate the parent
        if (
          [
            "applet",
            "base",
            "basefont",
            "bdo",
            "br",
            "font",
            "frame",
            "frameset",
            "head",
            "html",
            "iframe",
            "isindex",
            "meta",
            "param",
            "script",
            "style",
            "title",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-onkeyup",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }
        // if value is empty or otherwise does not exist
        else if (
          !(node.attribValueStartsAt as number) ||
          !node.attribValueEndsAt
        ) {
          context.report({
            ruleId: `attribute-validate-${node.attribName.toLowerCase()}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          // validate the script value
          let errorArr = validateScript(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );
          console.log(
            `072 attributeValidateOnkeyup(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`080 attributeValidateOnkeyup(): RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-onkeyup",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateOnkeyup;
