// rule: attribute-validate-size
// -----------------------------------------------------------------------------

import validateDigitAndUnit from "../../util/validateDigitAndUnit";
import checkForWhitespace from "../../util/checkForWhitespace";
import { fontSizeRegex } from "../../util/util";

function attributeValidateSize(context, ...opts) {
  return {
    attribute: function (node) {
      console.log(
        `███████████████████████████████████████ attributeValidateSize() ███████████████████████████████████████`
      );
      console.log(
        `015 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
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
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValueRaw,
            node.attribValueStartsAt
          );

          console.log(
            `046 attributeValidateSize(): charStart = ${charStart}; charEnd = ${charEnd}`
          );
          console.log(
            `049 attributeValidateSize(): ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

          // sort errorArr right here because some of the values will be
          // checked with regex quickly and it would be burden to stick
          // this whitespace reporting on every size attribute tag's case
          errorArr.forEach((errorObj) => {
            console.log(`060 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-size",
              })
            );
          });

          //
          //
          // now process each case of "size", depending by tag name
          //
          //

          if (Number.isInteger(charStart)) {
            // the attribute's value is not empty

            const extractedVal = node.attribValueRaw.slice(charStart, charEnd);
            console.log(
              `079 attributeValidateSize(): ${`\u001b[${33}m${`extractedVal`}\u001b[${39}m`} = ${JSON.stringify(
                extractedVal,
                null,
                4
              )}`
            );
            if (["hr", "input", "select"].includes(node.parent.tagName)) {
              console.log(`086 validate hr/input/select tag's size`);
              // no need to check whitespace, opts.skipWhitespaceChecks: true
              validateDigitAndUnit(
                extractedVal,
                node.attribValueStartsAt + charStart,
                {
                  type: "integer",
                  negativeOK: false,
                  theOnlyGoodUnits: [], // empty array means no units allowed
                  skipWhitespaceChecks: true,
                }
              ).forEach((errorObj) => {
                console.log(`098 RAISE ERROR`);
                context.report(
                  Object.assign({}, errorObj, {
                    ruleId: "attribute-validate-size",
                  })
                );
              });
            } else if (["font", "basefont"].includes(node.parent.tagName)) {
              console.log(`106 validate font/basefont tag's size`);
              if (!extractedVal.match(fontSizeRegex)) {
                const errorArr2 = validateDigitAndUnit(
                  extractedVal,
                  node.attribValueStartsAt + charStart,
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
                    idxFrom: node.attribValueStartsAt + charStart,
                    idxTo: node.attribValueStartsAt + charEnd,
                    message: `Should be integer 1-7, plus/minus are optional.`,
                    fix: null,
                  });
                }

                errorArr2.forEach((errorObj) => {
                  console.log(`134 RAISE ERROR`);
                  context.report(
                    Object.assign({}, errorObj, {
                      ruleId: "attribute-validate-size",
                    })
                  );
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
