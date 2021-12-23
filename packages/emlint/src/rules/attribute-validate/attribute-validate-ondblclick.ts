import { Linter, RuleObjType } from "../../linter";
import validateScript from "../../util/validateScript";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-ondblclick
// -----------------------------------------------------------------------------

function attributeValidateOndblclick(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateOndblclick() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `020 attributeValidateOndblclick(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "ondblclick") {
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
            ruleId: "attribute-validate-ondblclick",
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
          DEV &&
            console.log(
              `078 attributeValidateOndblclick(): received errorArr = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );

          errorArr.forEach((errorObj) => {
            DEV &&
              console.log(`087 attributeValidateOndblclick(): RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-ondblclick",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateOndblclick;
