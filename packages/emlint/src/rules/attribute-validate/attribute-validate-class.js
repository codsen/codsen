// rule: attribute-validate-class
// -----------------------------------------------------------------------------

import checkClassOrIdValue from "../../util/checkClassOrIdValue";
import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateClass(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateClass() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateClass(): node = ${JSON.stringify(node, null, 4)}`
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
            "title"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValue,
            node.attribValueStartAt
          );
          console.log(
            `052 \n${`\u001b[${33}m${`node.attribValueStartAt + charStart`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValueStartAt + charStart,
              null,
              4
            )}; \n${`\u001b[${33}m${`node.attribValueStartAt + charEnd`}\u001b[${39}m`} = ${JSON.stringify(
              node.attribValueStartAt + charEnd,
              null,
              4
            )}; \n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          checkClassOrIdValue(
            context.str,
            {
              typeName: node.attribName, // class|id|for
              from: node.attribValueStartAt + charStart,
              to: node.attribValueStartAt + charEnd,
              offset: 0
            },
            errorArr // might be mutated, more errors pushed into
          );

          console.log(
            `079 ███████████████████████████████████████\nFINALLY,\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`}:\n${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach(errorObj => {
            console.log(`087 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-class"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateClass;
