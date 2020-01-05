// rule: attribute-validate-media
// -----------------------------------------------------------------------------

import checkForWhitespace from "../../util/checkForWhitespace";
import isMediaD from "is-media-descriptor";

function attributeValidateMedia(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateMedia() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateMedia(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "media") {
        // validate the parent
        if (!["style", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-media",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }

        // beware, the charStart and charEnd are not offset, their "zero" is
        // start of an attribute's value, so if you use them, you need to
        // offset to the true index, you must add "node.attribValueStartAt" value
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        console.log(
          `044 ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
            charStart,
            null,
            4
          )}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
            charEnd,
            null,
            4
          )}`
        );
        console.log(
          `055 ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        // concat errors from "is-media-descriptor" and report all:
        errorArr
          .concat(
            isMediaD(node.attribValue.slice(charStart, charEnd), {
              offset: node.attribValueStartAt
            })
          )
          .forEach(errorObj => {
            console.log(`069 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-media"
              })
            );
          });
      }
    }
  };
}

export default attributeValidateMedia;
