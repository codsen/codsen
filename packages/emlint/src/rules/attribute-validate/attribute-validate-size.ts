import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-size
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";
import checkForWhitespace from "../../util/checkForWhitespace";
import { fontSizeRegex } from "../../util/util";

function attributeValidateSize(context: Linter): RuleObjType {
  return {
    attribute(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateSize() ███████████████████████████████████████`
      );

      // console.log(
      //   `015 attributeValidateSize(): node = ${JSON.stringify(node, null, 4)}`
      // );

      if (node.attribName === "size") {
        // validate the parent
        if (
          !["hr", "font", "input", "basefont", "select"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-size",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          let { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt as number
          );

          console.log(
            `042 attributeValidateSize(): charStart = ${charStart}; charEnd = ${charEnd}`
          );
          console.log(
            `045 attributeValidateSize(): ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          // sort errorArr right here because some of the values will be
          // checked with regex quickly and it would be burden to stick
          // this whitespace reporting on every size attribute tag's case
          errorArr.forEach((errorObj) => {
            console.log(`056 RAISE ERROR`);
            context.report({ ...errorObj, ruleId: "attribute-validate-size" });
          });

          //
          //
          // now process each case of "size", depending by tag name
          //
          //

          if (typeof charStart === "number" && typeof charEnd === "number") {
            // the attribute's value is not empty

            let extractedVal = node.attribValueRaw.slice(charStart, charEnd);
            console.log(
              `071 attributeValidateSize(): ${`\u001b[${33}m${`extractedVal`}\u001b[${39}m`} = ${JSON.stringify(
                extractedVal,
                null,
                4
              )}`
            );
            if (["hr", "input", "select"].includes(node.parent.tagName)) {
              console.log(`078 validate hr/input/select tag's size`);
              // no need to check whitespace, opts.skipWhitespaceChecks: true
              validateDigitAndUnit(
                extractedVal,
                (node.attribValueStartsAt as number) + charStart,
                {
                  type: "integer",
                  negativeOK: false,
                  theOnlyGoodUnits: [], // empty array means no units allowed
                  skipWhitespaceChecks: true,
                }
              ).forEach((errorObj) => {
                console.log(`090 RAISE ERROR`);
                context.report({
                  ...errorObj,
                  ruleId: "attribute-validate-size",
                });
              });
            } else if (["font", "basefont"].includes(node.parent.tagName)) {
              console.log(`097 validate font/basefont tag's size`);
              if (!extractedVal.match(fontSizeRegex)) {
                let errorArr2 = validateDigitAndUnit(
                  extractedVal,
                  (node.attribValueStartsAt as number) + charStart,
                  {
                    type: "integer",
                    negativeOK: false,
                    theOnlyGoodUnits: [], // empty array means no units allowed
                    skipWhitespaceChecks: true,
                    customGenericValueError: `Should be integer 1-7, plus/minus are optional.`,
                  }
                );

                if (!errorArr2.length) {
                  // if validateDigitAndUnit() didn't pick up any errors that
                  // possibly because they are too specific, like <font size="8">
                  // in which case, we raise a generic error against whole
                  // attribute's value
                  errorArr2.push({
                    idxFrom: (node.attribValueStartsAt as number) + charStart,
                    idxTo: (node.attribValueStartsAt as number) + charEnd,
                    message: `Should be integer 1-7, plus/minus are optional.`,
                    fix: null,
                  });
                }

                errorArr2.forEach((errorObj) => {
                  console.log(`125 RAISE ERROR`);
                  context.report({
                    ...errorObj,
                    ruleId: "attribute-validate-size",
                  });
                });
              }
            }
          }
        }
      }
    },
  };
}

export default attributeValidateSize;
