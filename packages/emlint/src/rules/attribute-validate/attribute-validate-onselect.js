// rule: attribute-validate-onselect
// -----------------------------------------------------------------------------

import validateScript from "../../util/validateScript";

function attributeValidateOnselect(context, ...originalOpts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnselect() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateOnselect(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      // preparing for the future:
      const opts = Object.assign({}, originalOpts);

      if (node.attribName === "onselect") {
        // validate the parent
        if (!["input", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onselect",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // validate the script value
          const errorArr = validateScript(
            node.attribValueRaw,
            node.attribValueStartsAt
          );
          console.log(
            `047 attributeValidateOnselect(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`055 attributeValidateOnselect(): RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onselect",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateOnselect;
