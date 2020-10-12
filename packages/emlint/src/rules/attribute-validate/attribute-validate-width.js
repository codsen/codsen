// rule: attribute-validate-width
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateWidth(context, ...opts) {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateWidth() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateWidth(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (node.attribName === "width") {
        // validate the parent
        if (
          ![
            "hr",
            "iframe",
            "img",
            "object",
            "table",
            "td",
            "th",
            "applet",
            "col",
            "colgroup",
            "pre",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-width",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else if (node.parent.tagName === "pre") {
          // number only
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            theOnlyGoodUnits: [],
            noUnitsIsFine: true,
          }).forEach((errorObj) => {
            console.log(`053 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-width" });
          });
        } else if (["colgroup", "col"].includes(node.parent.tagName)) {
          // multilength type
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            badUnits: ["px"],
            theOnlyGoodUnits: ["*", "%"],
            noUnitsIsFine: true,
          }).forEach((errorObj) => {
            console.log(`063 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-width" });
          });
        } else {
          // normal length
          validateDigitAndUnit(node.attribValueRaw, node.attribValueStartsAt, {
            badUnits: ["px"],
            noUnitsIsFine: true,
          }).forEach((errorObj) => {
            console.log(`072 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-width" });
          });
        }
      }
    },
  };
}

export default attributeValidateWidth;
