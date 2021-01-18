import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-charoff
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";

function attributeValidateCharoff(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateCharoff() ███████████████████████████████████████`
      );

      console.log(
        `020 attributeValidateCharoff(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (node.attribName === "charoff") {
        // validate the parent
        if (
          ![
            "col",
            "colgroup",
            "tbody",
            "td",
            "tfoot",
            "th",
            "thead",
            "tr",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-charoff",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // if value is empty or otherwise does not exist
        if (!(node.attribValueStartsAt as number) || !node.attribValueEndsAt) {
          context.report({
            ruleId: "attribute-validate-charoff",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Missing value.`,
            fix: null,
          });
        } else {
          const errorArr = validateDigitAndUnit(
            node.attribValueRaw,
            node.attribValueStartsAt as number,
            {
              type: "integer",
              negativeOK: true,
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units.",
            }
          );
          console.log(
            `071 received errorArr = ${JSON.stringify(errorArr, null, 4)}`
          );

          // tag has to have "char" attribute:
          if (
            !node.parent.attribs.some(
              (attribObj) => attribObj.attribName === "char"
            )
          ) {
            errorArr.push({
              idxFrom: node.parent.start,
              idxTo: node.parent.end,
              message: `Attribute "char" missing.`,
              fix: null,
            });
          }

          errorArr.forEach((errorObj) => {
            console.log(`089 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-charoff",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateCharoff;
