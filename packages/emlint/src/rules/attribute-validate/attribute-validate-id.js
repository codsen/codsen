// rule: attribute-validate-id
// -----------------------------------------------------------------------------

import checkClassOrIdValue from "../../util/checkClassOrIdValue";
import checkForWhitespace from "../../util/checkForWhitespace";

function attributeValidateId(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateId() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateId(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "id") {
        // validate the parent
        if (
          ["base", "head", "html", "meta", "script", "style", "title"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-id",
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
            `044 \n${`\u001b[${33}m${`node.attribValueStartAt + charStart`}\u001b[${39}m`} = ${JSON.stringify(
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

          console.log(
            `060 ${`\u001b[${36}m${`traverse and extract id's`}\u001b[${39}m`}`
          );

          checkClassOrIdValue(
            context.str,
            node.attribValueStartAt + charStart,
            node.attribValueStartAt + charEnd,
            errorArr, // might be mutated, more errors pushed into
            node.attribName
          );

          console.log(
            `072 ███████████████████████████████████████\nFINALLY,\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`}:\n${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach(errorObj => {
            console.log(`080 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-id"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateId;
