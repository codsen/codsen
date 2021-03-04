import { Linter, RuleObjType } from "../../linter";
import {
  RuleToken,
  Property,
} from "../../../../codsen-tokenizer/src/util/util";
import { AttribSupplementedWithParent } from "../../util/commonTypes";

// rule: css-trailing-semi
// -----------------------------------------------------------------------------

type Mode = "always" | "never";

/**
 * We consume two types of nodes, HTML "style" attributes and head CSS style
 * tag "rule"s. We need to DRY the processing into one place.
 */
function processNode(
  token: RuleToken | AttribSupplementedWithParent,
  context: Linter,
  mode: Mode
) {
  console.log(`022 css-trailing-semi/processNode() called`);
  // first let's set the properties array container, it might come
  // from different places, depending is it head CSS styles or inline HTML styles
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
      `036 css-trailing-semi/processNode(): ${`\u001b[${31}m${`early exit`}\u001b[${39}m`}`
    );
    return;
  }

  console.log(
    `042 css-trailing-semi/processNode(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nodeArr`}\u001b[${39}m`} = ${JSON.stringify(
      nodeArr,
      null,
      4
    )}`
  );

  // extract all properties - arr array records
  // all whitespace are as text tokens and we want to exclude them
  // also there can be other types of nodes, comments or ESP tags if
  // it's inline HTML style attribute

  const properties: Property[] = (nodeArr as any).filter(
    (property: any) => (property as any).property !== undefined
  );
  console.log(
    `058 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`properties`}\u001b[${39}m`} = ${JSON.stringify(
      properties as any,
      null,
      4
    )}`
  );

  const property: Property = properties[~-properties.length];
  if (
    mode !== "never" &&
    properties &&
    properties.length &&
    property.semi === null &&
    property.valueEnds
  ) {
    console.log(
      `074 ${`\u001b[${31}m${`caught a property without a semicolon`}\u001b[${39}m`}`
    );
    const idxFrom = property.start;
    const idxTo = property.end;
    const positionToInsert = (property.importantEnds ||
      property.valueEnds ||
      property.propertyEnds) as number;

    context.report({
      ruleId: "css-trailing-semi",
      idxFrom,
      idxTo,
      message: `Add a semicolon.`,
      fix: {
        ranges: [[positionToInsert, positionToInsert, ";"]],
      },
    });
  } else if (
    mode === "never" &&
    properties &&
    properties.length &&
    property.semi !== null &&
    property.valueEnds
  ) {
    const idxFrom = property.start;
    const idxTo = property.end;
    const positionToRemove = property.semi;
    context.report({
      ruleId: "css-trailing-semi",
      idxFrom,
      idxTo,
      message: `Remove the semicolon.`,
      fix: {
        ranges: [[positionToRemove, positionToRemove + 1]],
      },
    });
  }
}
interface TrailingSemi {
  (context: Linter, mode: Mode): RuleObjType;
}
const trailingSemi: TrailingSemi = (context, mode) => {
  console.log(`116 trailingSemi(): mode = ${JSON.stringify(mode, null, 4)}`);
  return {
    rule(node) {
      console.log(
        `███████████████████████████████████████ trailingSemi(), rule ███████████████████████████████████████`
      );
      console.log(
        `123 trailingSemi(): incoming ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );
      processNode(node, context, mode);
    },
    attribute(node) {
      console.log(
        `███████████████████████████████████████ trailingSemi(), attr ███████████████████████████████████████`
      );
      console.log(
        `136 trailingSemi(): incoming ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );
      processNode(node, context, mode);
    },
  };
};

export default trailingSemi;
