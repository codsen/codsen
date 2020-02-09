// rule: attribute-validate-onchange
// -----------------------------------------------------------------------------

import validateScript from "../../util/validateScript";

function attributeValidateOnchange(context, ...originalOpts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnchange() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateOnchange(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      // preparing for the future:
      const opts = Object.assign({}, originalOpts);

      if (node.attribName === "onchange") {
        // validate the parent
        if (!["input", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onchange",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          // validate the script value
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartsAt
          );
          console.log(
            `047 attributeValidateOnchange(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach(errorObj => {
            console.log(`055 attributeValidateOnchange(): RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onchange"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateOnchange;
