import { Linter, RuleObjType } from "../../linter";
import { ErrorObj } from "../../util/commonTypes";

// rule: attribute-validate-align
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateAlign(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateAlign() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `021 attributeValidateAlign(): node = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (node.attribName === "align") {
        // validate the parent
        if (
          ![
            "applet",
            "caption",
            "iframe",
            "img",
            "input",
            "object",
            "legend",
            "table",
            "hr",
            "div",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
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
            ruleId: "attribute-validate-align",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // check in two parts, first, a quick try, match the most common values only
        let errorArr: ErrorObj[] = [];

        if (["legend", "caption"].includes(node.parent.tagName.toLowerCase())) {
          // top|bottom|left|right
          errorArr = validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              permittedValues: ["top", "bottom", "left", "right"],
              canBeCommaSeparated: false,
            }
          );
        } else if (
          ["applet", "iframe", "img", "input", "object"].includes(
            node.parent.tagName.toLowerCase()
          )
        ) {
          // top|middle|bottom|left|right
          errorArr = validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              permittedValues: ["top", "middle", "bottom", "left", "right"],
              canBeCommaSeparated: false,
            }
          );
        } else if (
          ["table", "hr"].includes(node.parent.tagName.toLowerCase())
        ) {
          // left|center|right
          errorArr = validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              permittedValues: ["left", "center", "right"],
              canBeCommaSeparated: false,
            }
          );
        } else if (
          ["div", "h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(
            node.parent.tagName.toLowerCase()
          )
        ) {
          // left|center|right|justify
          errorArr = validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              permittedValues: ["left", "center", "right", "justify"],
              canBeCommaSeparated: false,
            }
          );
        } else if (
          [
            "col",
            "colgroup",
            "tbody",
            "td",
            "tfoot",
            "th",
            "thead",
            "tr",
          ].includes(node.parent.tagName.toLowerCase())
        ) {
          // left|center|right|justify|char
          errorArr = validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              permittedValues: ["left", "center", "right", "justify", "char"],
              canBeCommaSeparated: false,
            }
          );
        }

        DEV &&
          console.log(
            `${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );

        errorArr.forEach((errorObj) => {
          DEV && console.log(`154 RAISE ERROR`);
          context.report({ ...errorObj, ruleId: "attribute-validate-align" });
        });
      }
    },
  };
}

export default attributeValidateAlign;
