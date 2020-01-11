// rule: attribute-validate-type
// -----------------------------------------------------------------------------

import { validateString } from "../../util/util";
import db from "mime-db";

function attributeValidateType(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateType() ███████████████████████████████████████`
      );
      console.log(
        `014 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `021 attributeValidateType(): node = ${JSON.stringify(node, null, 4)}`
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
            "button"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-type",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          // validate depending on type
          if (
            ["a", "link", "object", "param", "script", "style"].includes(
              node.parent.tagName
            )
          ) {
            validateString(
              node.attribValue, // value
              node.attribValueStartAt, // offset
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
                  "application/vnd.api+json"
                ],
                permittedValues: Object.keys(db),
                canBeCommaSeparated: false,
                noSpaceAfterComma: false
              }
            ).forEach(errorObj => {
              console.log(`095 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-type"
                })
              );
            });
          } else if (node.parent.tagName === "input") {
            validateString(
              node.attribValue, // value
              node.attribValueStartAt, // offset
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
                  "button"
                ],
                permittedValues: null,
                canBeCommaSeparated: false,
                noSpaceAfterComma: false
              }
            ).forEach(errorObj => {
              console.log(`124 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-type"
                })
              );
            });
          } else if (node.parent.tagName === "li") {
            validateString(
              node.attribValue, // value
              node.attribValueStartAt, // offset
              {
                quickPermittedValues: [
                  "disc",
                  "square",
                  "circle",
                  "1",
                  "a",
                  "A",
                  "i",
                  "I"
                ],
                permittedValues: null,
                canBeCommaSeparated: false,
                noSpaceAfterComma: false
              }
            ).forEach(errorObj => {
              console.log(`151 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-type"
                })
              );
            });
          } else if (node.parent.tagName === "ol") {
            validateString(
              node.attribValue, // value
              node.attribValueStartAt, // offset
              {
                quickPermittedValues: ["1", "a", "A", "i", "I"],
                permittedValues: null,
                canBeCommaSeparated: false,
                noSpaceAfterComma: false
              }
            ).forEach(errorObj => {
              console.log(`169 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-type"
                })
              );
            });
          } else if (node.parent.tagName === "ul") {
            validateString(
              node.attribValue, // value
              node.attribValueStartAt, // offset
              {
                quickPermittedValues: ["disc", "square", "circle"],
                permittedValues: null,
                canBeCommaSeparated: false,
                noSpaceAfterComma: false
              }
            ).forEach(errorObj => {
              console.log(`187 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-type"
                })
              );
            });
          } else if (node.parent.tagName === "button") {
            validateString(
              node.attribValue, // value
              node.attribValueStartAt, // offset
              {
                quickPermittedValues: ["button", "submit", "reset"],
                permittedValues: null,
                canBeCommaSeparated: false,
                noSpaceAfterComma: false
              }
            ).forEach(errorObj => {
              console.log(`205 RAISE ERROR`);
              context.report(
                Object.assign({}, errorObj, {
                  ruleId: "attribute-validate-type"
                })
              );
            });
          }
        }
      }
    }
  };
}

export default attributeValidateType;
