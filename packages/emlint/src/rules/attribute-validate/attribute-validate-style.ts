import { Linter, RuleObjType } from "../../linter";
import validateStyle from "../../util/validateStyle";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: attribute-validate-style
// -----------------------------------------------------------------------------

function attributeValidateStyle(
  context: Linter,
  ...opts: string[]
): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateStyle() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `022 attribute-validate-style: incoming ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );
      DEV &&
        console.log(
          `030 attribute-validate-style: ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
            opts,
            null,
            4
          )}`
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

        // validate the contents
        if (node.attribValueRaw?.trim()) {
          DEV &&
            console.log(
              `065 ${`\u001b[${35}m${`CALL validateStyle()`}\u001b[${39}m`}`
            );
          validateStyle(node, context);
        } else {
          DEV &&
            console.log(`070 ${`\u001b[${31}m${`empty style`}\u001b[${39}m`}`);
          context.report({
            ruleId: "attribute-validate-style",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        }
      }
    },
  };
}

export default attributeValidateStyle;
