import { Linter, RuleObjType } from "../../linter";
import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-title
// -----------------------------------------------------------------------------

function attributeValidateTitle(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateTitle() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `020 attributeValidateTitle(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "title") {
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
            "title",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-title",
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
          DEV &&
            console.log(
              `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );

          errorArr.forEach((errorObj) => {
            DEV && console.log(`075 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-title" });
          });
        }
      }
    },
  };
}

export default attributeValidateTitle;
