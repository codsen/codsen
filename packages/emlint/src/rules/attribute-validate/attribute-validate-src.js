// rule: attribute-validate-src
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateSrc(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateSrc() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateSrc(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "src") {
        // validate the parent
        if (
          !["script", "input", "frame", "iframe", "img"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-src",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null,
          });
        } else {
          validateUri(node.attribValue, {
            offset: node.attribValueStartsAt,
            multipleOK: false,
          }).forEach((errorObj) => {
            console.log(`042 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-src",
              })
            );
          });
        }
      }
    },
  };
}

export default attributeValidateSrc;
