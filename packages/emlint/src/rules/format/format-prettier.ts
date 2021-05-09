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

  // there can be text nodes within properties array!
  // a whitespace is still a text node!!!!
  (nodeArr as Property[])
    .filter((property) => property.property !== undefined)
    .forEach((property) => {
      // console.log(
      //   `055 ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ${`\u001b[${33}m${`property`}\u001b[${39}m`} = ${JSON.stringify(
      //     property,
      //     null,
      //     4
      //   )}`
      // );

      // 1. missing space in after a colon
      if (
        property.colon &&
        property.valueStarts &&
        (property.valueStarts !== property.colon + 2 ||
          context.str[property.colon + 1] !== " ")
      ) {
        console.log(
          `062 format-prettier/processCSS(): space after colon missing`
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
        property.valueEnds ||
        (property.colon ? property.colon + 1 : null) ||
        property.propertyEnds;
      if (
        property.importantStarts &&
        lastEnding &&
        (lastEnding + 1 !== property.importantStarts ||
          context.str[lastEnding] !== " ")
      ) {
        console.log(
          `087 FIY, ${`\u001b[${33}m${`property.importantStarts`}\u001b[${39}m`} = ${JSON.stringify(
            property.importantStarts,
            null,
            4
          )}`
        );
        console.log(
          `094 format-prettier/processCSS(): missing space in front of !imporant`
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

  // 3. space after semi

  // It's more complex because 1) space is added only between properties;
  // and 2) only if text of property token is in front - mind you, there
  // can be ESP tokens, comment tokens and so on. Hence we traverse "nodeArr".
  if (nodeArr.length > 1) {
    let somethingMet = false;
    for (let i = 0, len = nodeArr.length; i < len; i++) {
      console.log(
        `117 SET ${`\u001b[${33}m${`nodeArr[i]`}\u001b[${39}m`} = ${JSON.stringify(
          nodeArr[i],
          null,
          4
        )}`
      );
      // if it's text token, maybe it's whitespace, so enforce its value
      // to be a single space
      if (
        somethingMet &&
        // it's a property
        (nodeArr[i].property !== undefined ||
          // or CSS comment
          (nodeArr[i].type === "comment" &&
            // and it's an opening comment
            !nodeArr[i].closing) ||
          // or ESP token
          (nodeArr[i].type === "esp" &&
            // two tokens in front it's a property
            nodeArr[i - 2] &&
            nodeArr[i - 2].property !== undefined)) &&
        // and it's text before it
        nodeArr[i - 1].type === "text" &&
        nodeArr[i - 1].value !== " " &&
        // if we're dealing with ESP tokens, allow line breaks
        (nodeArr[i].type !== "esp" ||
          (!nodeArr[i - 1].value.includes("\n") &&
            !nodeArr[i - 1].value.includes("\r")))
      ) {
        console.log(
          `147 format-prettier/processCSS(): some whitespace is wrong...`
        );
        context.report({
          ruleId: "format-prettier",
          idxFrom: nodeArr[i - 1].start,
          idxTo: nodeArr[i - 1].end,
          message: `Should be a single space.`,
          fix: {
            ranges: [[nodeArr[i - 1].start, nodeArr[i - 1].end, " "]],
          },
        });
      } else if (
        // we're not at the first token (zero'th element will be falsey)
        i &&
        // it's not a text token in front
        !["text", "esp"].includes(nodeArr[i - 1].type) &&
        // and it's a property currently here
        nodeArr[i].property !== undefined &&
        // it's not blank:
        // <style>.a{;;}</style><body>a</body>
        //           ^^
        (nodeArr[i].property || nodeArr[i].value || nodeArr[i].important)
      ) {
        // then it's an issue right away because if there was a whitespace gap,
        // it would be a text token
        console.log(
          `173 format-prettier/processCSS(): space in front of ${nodeArr[i].start} missing`
        );
        context.report({
          ruleId: "format-prettier",
          idxFrom: nodeArr[i].start,
          idxTo: nodeArr[i].end,
          message: `Put a space in front.`,
          fix: {
            ranges: [[nodeArr[i].start, nodeArr[i].start, " "]],
          },
        });
      }

      if (
        !somethingMet &&
        (nodeArr[i].type === undefined || nodeArr[i].type !== "text")
      ) {
        somethingMet = true;
      }
    }
  }
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
