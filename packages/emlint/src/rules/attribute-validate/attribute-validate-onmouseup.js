// rule: attribute-validate-onmouseup
// -----------------------------------------------------------------------------

import validateScript from "../../util/validateScript";

function attributeValidateOnmouseup(context, ...originalOpts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnmouseup() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateOnmouseup(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      // preparing for the future:
      const opts = Object.assign({}, originalOpts);

      if (node.attribName === "onmouseup") {
        // validate the parent
        if (
          [
            "applet",
            "base",
            "basefont",
            "bdo",
            "br",
            "font",
            "frame",
            "frameset",
            "head",
            "html",
            "iframe",
            "isindex",
            "meta",
            "param",
            "script",
            "style",
            "title"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-onmouseup",
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
            `067 attributeValidateOnmouseup(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach(errorObj => {
            console.log(`075 attributeValidateOnmouseup(): RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onmouseup"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateOnmouseup;
