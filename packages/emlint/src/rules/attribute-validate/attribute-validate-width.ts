import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-width
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateWidth(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateWidth() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `021 attributeValidateWidth(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
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
          validateDigitAndUnit(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              theOnlyGoodUnits: [],
              noUnitsIsFine: true,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`062 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-width" });
          });
        } else if (["colgroup", "col"].includes(node.parent.tagName)) {
          // multilength type
          validateDigitAndUnit(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              badUnits: ["px"],
              theOnlyGoodUnits: ["*", "%"],
              noUnitsIsFine: true,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`076 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-width" });
          });
        } else {
          // normal length
          validateDigitAndUnit(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              badUnits: ["px"],
              noUnitsIsFine: true,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`089 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-width" });
          });
        }
      }
    },
  };
}

export default attributeValidateWidth;
