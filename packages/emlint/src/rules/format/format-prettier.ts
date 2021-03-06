import { Linter, RuleObjType } from "../../linter";
import { AttribSupplementedWithParent } from "../../util/commonTypes";
import {
  RuleToken,
  Property,
} from "../../../../codsen-tokenizer/src/util/util";

// rule: format-prettier
// it tries to format to how Prettier would
// -----------------------------------------------------------------------------

function processCSS(
  token: RuleToken | AttribSupplementedWithParent,
  context: Linter
) {
  // group all CSS processing into one function
  console.log(
    `018 format-prettier/processCSS(): ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
      token,
      null,
      4
    )}`
  );

  let nodeArr;
  if ((token as any).properties !== undefined) {
    // head CSS rule
    nodeArr = (token as any).properties;
  } else if ((token as any).attribValue !== undefined) {
    // inline HTML style attribute
    nodeArr = (token as any).attribValue;
  }

  if (!nodeArr) {
    console.log(
      `036 format-prettier/processCSS(): ${`\u001b[${31}m${`early exit`}\u001b[${39}m`}`
    );
    return;
  }

  console.log(
    `042 format-prettier/processCSS(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nodeArr`}\u001b[${39}m`} = ${JSON.stringify(
      nodeArr,
      null,
      4
    )}`
  );

  // there can be text nodes within properties array!
  // a whitespace is still a text node!!!!
  (nodeArr as Property[])
    .filter((property) => property.property !== undefined)
    .forEach((property) => {
      console.log(
        `055 ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
          property,
          null,
          4
        )}`
      );

      // 1. missing space in after a colon
      if (
        property.colon &&
        property.valueStarts &&
        property.valueStarts !== property.colon + 2
      ) {
        console.log(
          `069 format-prettier/processCSS(): space after colon missing`
        );
        context.report({
          ruleId: "format-prettier",
          idxFrom: property.start,
          idxTo: property.end,
          message: `Put a space before a value.`,
          fix: {
            ranges: [[property.colon + 1, property.valueStarts, " "]],
          },
        });
      }

      // 2. missing space after an !important
      const lastEnding =
        property.valueEnds || property.colon || property.propertyEnds;
      if (
        property.importantStarts &&
        lastEnding &&
        lastEnding + 1 !== property.importantStarts
      ) {
        console.log(
          `091 format-prettier/processCSS(): space after !important missing`
        );
        context.report({
          ruleId: "format-prettier",
          idxFrom: property.start,
          idxTo: property.end,
          message: `Put a space in front of !imporant.`,
          fix: {
            ranges: [[lastEnding, property.importantStarts, " "]],
          },
        });
      }
    });
}

interface formatPrettier {
  (context: Linter): RuleObjType;
}

const formatPrettier: formatPrettier = (context) => {
  return {
    rule(node) {
      console.log(
        `███████████████████████████████████████ formatPrettier(), rule ███████████████████████████████████████`
      );
      // format the head CSS style rule
      processCSS(node, context);
    },
    attribute(node) {
      console.log(
        `███████████████████████████████████████ formatPrettier(), attr ███████████████████████████████████████`
      );
      // format the inline HTML style attribute CSS rules
      processCSS(node, context);
    },
  };
};

export default formatPrettier;
