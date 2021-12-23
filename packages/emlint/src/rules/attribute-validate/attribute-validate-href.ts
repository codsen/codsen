import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-href
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateHref(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateHref() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateHref(): node = ${JSON.stringify(node, null, 4)}`
        );

      if (node.attribName === "href") {
        // validate the parent
        if (!["a", "area", "link", "base"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-href",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt as number,
            multipleOK: false,
          }).forEach((errorObj) => {
            DEV && console.log(`039 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-href" });
          });
        }
      }
    },
  };
}

export default attributeValidateHref;
