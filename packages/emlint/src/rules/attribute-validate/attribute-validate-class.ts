import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-class
// -----------------------------------------------------------------------------

import checkClassOrIdValue from "../../util/checkClassOrIdValue";
import checkForWhitespace from "../../util/checkForWhitespace";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateClass(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateClass() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `022 attributeValidateClass(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "class") {
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
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          let { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );
          DEV &&
            console.log(
              `069 \n${`\u001b[${33}m${`(node.attribValueStartsAt as number) + charStart`}\u001b[${39}m`} = ${JSON.stringify(
                (node.attribValueStartsAt as number) + (charStart as number),
                null,
                4
              )}; \n${`\u001b[${33}m${`(node.attribValueStartsAt as number) + charEnd`}\u001b[${39}m`} = ${JSON.stringify(
                (node.attribValueStartsAt as number) + (charEnd as number),
                null,
                4
              )}; \n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );

          if (typeof charStart === "number" && typeof charEnd === "number") {
            checkClassOrIdValue(
              context.str,
              {
                typeName: node.attribName, // class|id|for
                from: (node.attribValueStartsAt as number) + charStart,
                to: (node.attribValueStartsAt as number) + charEnd,
                offset: 0,
              },
              errorArr // might be mutated, more errors pushed into
            );
          }

          DEV &&
            console.log(
              `099 ███████████████████████████████████████\nFINALLY,\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`}:\n${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );

          errorArr.forEach((errorObj) => {
            DEV && console.log(`107 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-class" });
          });
        }
      }
    },
  };
}

export default attributeValidateClass;
