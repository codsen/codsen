import db from "mime-db";

import { Linter, RuleObjType } from "../../linter";

// rule: attribute-validate-type
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function attributeValidateType(context: Linter): RuleObjType {
  return {
    attribute(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeValidateType() ███████████████████████████████████████`
        );

      DEV &&
        console.log(
          `023 attributeValidateType(): node = ${JSON.stringify(node, null, 4)}`
        );

      if (node.attribName === "type") {
        // validate the parent
        if (
          ![
            "a",
            "link",
            "object",
            "param",
            "script",
            "style",
            "input",
            "li",
            "ol",
            "ul",
            "button",
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-type",
            idxFrom: node.attribStarts,
            idxTo: node.attribEnds,
            message: `Tag "${node.parent.tagName}" can't have attribute "${node.attribName}".`,
            fix: null,
          });
        }

        // validate depending on type
        else if (
          ["a", "link", "object", "param", "script", "style"].includes(
            node.parent.tagName
          )
        ) {
          validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              quickPermittedValues: [
                "application/javascript",
                "application/json",
                "application/x-www-form-urlencoded",
                "application/xml",
                "application/zip",
                "application/pdf",
                "application/sql",
                "application/graphql",
                "application/ld+json",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.oasis.opendocument.text",
                "application/zstd",
                "audio/mpeg",
                "audio/ogg",
                "multipart/form-data",
                "text/css",
                "text/html",
                "text/xml",
                "text/csv",
                "text/plain",
                "image/png",
                "image/jpeg",
                "image/gif",
                "application/vnd.api+json",
              ],
              permittedValues: Object.keys(db),
              canBeCommaSeparated: false,
              noSpaceAfterComma: false,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`098 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-type",
            });
          });
        } else if (node.parent.tagName === "input") {
          validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              quickPermittedValues: [
                "text",
                "password",
                "checkbox",
                "radio",
                "submit",
                "reset",
                "file",
                "hidden",
                "image",
                "button",
              ],
              canBeCommaSeparated: false,
              noSpaceAfterComma: false,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`125 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-type",
            });
          });
        } else if (node.parent.tagName === "li") {
          validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              quickPermittedValues: [
                "disc",
                "square",
                "circle",
                "1",
                "a",
                "A",
                "i",
                "I",
              ],

              canBeCommaSeparated: false,
              noSpaceAfterComma: false,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`151 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-type",
            });
          });
        } else if (node.parent.tagName === "ol") {
          validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              quickPermittedValues: ["1", "a", "A", "i", "I"],

              canBeCommaSeparated: false,
              noSpaceAfterComma: false,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`168 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-type",
            });
          });
        } else if (node.parent.tagName === "ul") {
          validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              quickPermittedValues: ["disc", "square", "circle"],

              canBeCommaSeparated: false,
              noSpaceAfterComma: false,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`185 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-type",
            });
          });
        } else if (node.parent.tagName === "button") {
          validateString(
            node.attribValueRaw, // value
            node.attribValueStartsAt as number, // offset
            {
              quickPermittedValues: ["button", "submit", "reset"],

              canBeCommaSeparated: false,
              noSpaceAfterComma: false,
            }
          ).forEach((errorObj) => {
            DEV && console.log(`202 RAISE ERROR`);
            context.report({
              ...errorObj,
              ruleId: "attribute-validate-type",
            });
          });
        }
      }
    },
  };
}

export default attributeValidateType;
