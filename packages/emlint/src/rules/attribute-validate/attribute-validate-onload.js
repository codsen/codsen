// rule: attribute-validate-onload
// -----------------------------------------------------------------------------

import validateScript from "../../util/validateScript";

function attributeValidateOnload(context, ...originalOpts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnload() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateOnload(): node = ${JSON.stringify(node, null, 4)}`
      );

      // preparing for the future:
      const opts = Object.assign({}, originalOpts);

      if (node.attribName === "onload") {
        // validate the parent
        if (!["frameset", "body"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onload",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          // validate the script value
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartAt
          );
          console.log(
            `043 attributeValidateOnload(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach(errorObj => {
            console.log(`051 attributeValidateOnload(): RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onload"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateOnload;
