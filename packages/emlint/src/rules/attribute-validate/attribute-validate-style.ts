import { Linter, RuleObjType } from "../../linter";
import validateInlineStyle from "../../util/validateInlineStyle";

// rule: attribute-validate-style
// -----------------------------------------------------------------------------

function attributeValidateStyle(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateStyle() ███████████████████████████████████████`
      );

      if (node.attribName === "style") {
        // validate the parent
        if (
          [
            "base",
            "basefont",
            "head",
            "html",
            "meta",
            "param",
            "script",
            "style",
            "title",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-style",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        const errorArr = validateInlineStyle(
          node.attribValueRaw,
          node.attribValueStartsAt as number
        );
        console.log(
          `050 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
        );

        errorArr.forEach((errorObj) => {
          console.log(`054 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-style" });
        });
      }
    },
  };
}

export default attributeValidateStyle;
