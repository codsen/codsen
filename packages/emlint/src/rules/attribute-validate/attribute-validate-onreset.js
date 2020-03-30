// rule: attribute-validate-onreset
// -----------------------------------------------------------------------------

import validateScript from "../../util/validateScript";

function attributeValidateOnreset(context, ...originalOpts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnreset() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateOnreset(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      // preparing for the future:
      const opts = Object.assign({}, originalOpts);

      if (node.attribName === "onreset") {
        // validate the parent
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-onreset",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          // validate the script value
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartsAt
          );
          console.log(
            `047 attributeValidateOnreset(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach((errorObj) => {
            console.log(`055 attributeValidateOnreset(): RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onreset",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateOnreset;
