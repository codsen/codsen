// rule: attribute-validate-onmousedown
// -----------------------------------------------------------------------------

import validateScript from "../../util/validateScript";

function attributeValidateOnmousedown(context, ...originalOpts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateOnmousedown() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateOnmousedown(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      // preparing for the future:
      const opts = Object.assign({}, originalOpts);

      if (node.attribName === "onmousedown") {
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
            ruleId: "attribute-validate-onmousedown",
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
            `067 attributeValidateOnmousedown(): received errorArr = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          errorArr.forEach(errorObj => {
            console.log(`075 attributeValidateOnmousedown(): RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onmousedown"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateOnmousedown;
