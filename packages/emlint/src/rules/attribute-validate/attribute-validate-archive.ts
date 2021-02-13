import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-archive
// -----------------------------------------------------------------------------

import validateUri from "../../util/validateUri";

function attributeValidateArchive(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateArchive() ███████████████████████████████████████`
      );

      console.log(
        `016 attributeValidateArchive(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "archive") {
        // validate the parent
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-archive",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else if (
          !(node.attribValueStartsAt as number) ||
          !node.attribValueEndsAt
        ) {
          // maybe value is missing anyway?
          context.report({
            ruleId: `attribute-validate-${node.attribName}`,
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        }
        // it depends, which tag is this attribute on...
        else if (node.parent.tagName === "applet") {
          // comma-separated list of archive URIs
          // Call validation upon the whole attribute's value. Validator includes
          // whitespace checks.
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt as number,
            separator: "comma",
            multipleOK: true,
          }).forEach((errorObj) => {
            console.log(`056 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-archive",
            });
          });
        } else if (node.parent.tagName === "object") {
          // space-separated list of URIs
          // Call validation upon the whole attribute's value. Validator includes
          // whitespace checks.
          validateUri(node.attribValueRaw, {
            offset: node.attribValueStartsAt as number,
            separator: "space", // or "comma"
            multipleOK: true,
          }).forEach((errorObj) => {
            console.log(`071 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-archive",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateArchive;
