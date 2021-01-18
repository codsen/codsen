import { Linter, RuleObjType } from "../../linter";
import { isMediaD } from "is-media-descriptor";
import checkForWhitespace from "../../util/checkForWhitespace";

// rule: attribute-validate-media
// -----------------------------------------------------------------------------

function attributeValidateMedia(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateMedia() ███████████████████████████████████████`
      );

      console.log(
        `021 attributeValidateMedia(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "media") {
        // validate the parent
        if (!["style", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-media",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // beware, the charStart and charEnd are not offset, their "zero" is
        // start of an attribute's value, so if you use them, you need to
        // offset to the true index, you must add "(node.attribValueStartsAt as number)" value
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValueRaw,
          node.attribValueStartsAt as number
        );
        console.log(
          `${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
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
          `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
            errorArr,
            null,
            4
          )}`
        );
        // concat errors from "is-media-descriptor" and report all:
        errorArr
          .concat(
            isMediaD(
              node.attribValueRaw.slice(charStart as number, charEnd as number),
              {
                offset: node.attribValueStartsAt as number,
              }
            )
          )
          .forEach((errorObj) => {
            console.log(`069 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-media" });
          });
      }
    },
  };
}

export default attributeValidateMedia;
